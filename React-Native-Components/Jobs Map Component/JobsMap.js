import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import { functions } from '../../Functions/firebase';
import { httpsCallable } from "firebase/functions";



/**
 * @name JobsMap
 * @description A component that displays a static map of all filtered job sites. When rendering multiple jobs at the same location, we move the pin up and to the right to create a minor cluster effect.
 * @param {Array} jobs - array of job Objects that contain our Job Data (buildingAddress, user, startDate....)
 * @param {Date} filterStartDate - start date of the date range filter
 * @param {Date} filterEndDate - end date of the date range filter
 * @param {Boolean} useSingleColor - integer value of the color
 * @param {Array} users - array of users
 * @returns {JSX.Element} static map of jobs
 * TODO: Filter the jobs on the map based on the date range.
 */
const JobsMap = ({ jobs, start, end, colors }) => {

    if (jobs.length == 0) { return null; }

    const [mapString, setMapString] = useState('');

    // calculate the geographical center
    function getGeographicalCenter(coordinates) {
        let minX, maxX, minY, maxY;
        coordinates.forEach(coord => {
            if (minX == null || coord.lat < minX) minX = coord.lat;
            if (maxX == null || coord.lat > maxX) maxX = coord.lat;
            if (minY == null || coord.lng < minY) minY = coord.lng;
            if (maxY == null || coord.lng > maxY) maxY = coord.lng;
        });
        return { lat: (minX + maxX) / 2, lng: (minY + maxY) / 2 };
    }

    //calculate the zoom level based on distance
    function calculateZoomLevel(minLat, maxLat, minLng, maxLng, mapWidth, mapHeight) {
        const WORLD_DIM = { height: 256, width: 256 };
        const ZOOM_MAX = 21;

        function latRad(lat) {
            var sin = Math.sin(lat * Math.PI / 180);
            var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
            return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
        }

        function zoom(mapPx, worldPx, fraction) {
            return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
        }

        var latFraction = (latRad(maxLat) - latRad(minLat)) / Math.PI;

        var lngDiff = maxLng - minLng;
        var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

        var latZoom = zoom(mapHeight, WORLD_DIM.height, latFraction);
        var lngZoom = zoom(mapWidth, WORLD_DIM.width, lngFraction);

        return Math.min(latZoom, lngZoom, ZOOM_MAX);
    }

    function getBounds(coordinates) {
        let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;

        coordinates.forEach(coord => {
            if (coord.lat < minLat) minLat = coord.lat;
            if (coord.lat > maxLat) maxLat = coord.lat;
            if (coord.lng < minLng) minLng = coord.lng;
            if (coord.lng > maxLng) maxLng = coord.lng;
        });

        return { minLat, maxLat, minLng, maxLng };
    }

    useEffect(() => {
        async function fetchCoordsForJobs() {
            let markers = "";

            const adjustedStart = start ? new Date(start.getTime()) : null; // start of the day
            const adjustedEnd = end ? new Date(end.getTime()) : null;
            if (adjustedEnd) {
                adjustedEnd.setHours(23, 59, 59, 999); // end of the day
            }

            // Filter jobs based on the date range or include all if dates are not provided
            let filteredJobs;
            if (start && end) {
                // Filter jobs based on the date range if both start and end dates are defined
                filteredJobs = jobs.filter(job => {
                    const jobDate = new Date(job.startDate.seconds * 1000); // Convert to milliseconds
                    return (!adjustedStart || jobDate >= adjustedStart) && (!adjustedEnd || jobDate <= adjustedEnd);
                });
            } else {
                // If either start or end date is not defined, use the entire jobs array
                filteredJobs = jobs;
            }
            //Filter the jobs so that only one for each building is stored in an array
            const jobsByBuilding = filteredJobs.filter((job, index, self) => {
                return index === self.findIndex((t) => (
                    t.buildingAddress === job.buildingAddress
                ))
            });

            try {
                //Generate an array of addresses only
                const addresses = jobsByBuilding.map(job => job.buildingAddress);

                //Note - MakeRequest is a cloud function that takes an array of addresses and returns an array of lat and lng for each address. By using our own cloud function, we can avoid exposing our API key to the client. You can replace this with your own API call if you prefer to use your own API key in order to retrieve the lat and lng for each address.
                const MakeRequest = httpsCallable(functions, "MakeRequest");
                await MakeRequest({ addresses: addresses })
                    .then((result) => {

                        //Assign colors for each marker based on the addresses
                        result.data.forEach(address => {
                            // ---------- MULTIPLE PINS
                            let offset = 0;
                            jobs.forEach(job => {
                                if (job.buildingAddress === address.id) {
                                    //Get the user from the job and compare it to the colors array
                                    const color = colors.find(color => color.user === job.user);
                                    let colorCorretted = color.color.replace('#', '');
                                    //Generate the string for the map
                                    markers += `&markers=size:mid%7Ccolor:0x${colorCorretted}%7Clabel:${color.user[0]}%7C${address.lat - offset},${address.lng + offset}`;
                                    offset += 0.001;
                                }
                            });
                        });

                        let center;
                        let zoomLevel;

                        if (result.data.length === 1) {
                            // If there's only one location, set center to that location and use a default zoom level
                            center = { lat: result.data[0].lat, lng: result.data[0].lng };
                            zoomLevel = 15; // Adjust this value as needed for a good single-location view
                        } else {
                            // For multiple locations, calculate the center and zoom level
                            const coordinates = result.data.map(address => ({ lat: address.lat, lng: address.lng }));
                            center = getGeographicalCenter(coordinates);
                            const bounds = getBounds(coordinates);
                            zoomLevel = calculateZoomLevel(bounds.minLat, bounds.maxLat, bounds.minLng, bounds.maxLng, 600, 300);
                        }

                        //Use your own API credentials here
                        const RestrictedApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
                        var mapString = `https://maps.googleapis.com/maps/api/staticmap?center=${center.lat},${center.lng}&zoom=${zoomLevel}&size=${600}x${300}&scale=2&maptype=roadmap${markers}&format=png&key=${RestrictedApiKey}`;
                        
                        setMapString(mapString);
                    });
            } catch (error) {
                console.error('Error:', error);
            }
        }

        fetchCoordsForJobs();
    }, [jobs, start, end]);



    return (
        <View style={styles.container}>
            {mapString != '' && Platform.OS === 'web' ? (
                <img width="100%" height="400" object-fit='fill' src={mapString} alt="Google map of Somewhere" />
            ) : (
                <Image style={{ width: "100%", height: "400", objectFit: 'fill' }} src={mapString} alt="Google map of Somewhere" />
            )}
        </View>
    );
};

const colorPallette = {
    primary_red: "#B22222",
    primary_orange: "#ED5829",
    accent_color: "#09ABF0",
    text_color: "#4C504E",
    button_pressed: "#898989",
    accent_green: "#2BB549",
    lightBlue: "#1ecfea",
    light_grey: "#e5e5e5",
    placeholderText: "#a7a7a7",
    cal_prev: "#e6e6e6",
    cal_current: "#ffffff",
    cal_next: "#ffffff",
    calHead_prev: "#b3b3b3",
    calHead_current: "#ffcc66",
    calHead_next: "#d3d3d3",
    primary_white: "#ffffff",
    primary_platinum: "#E6EAEF",
    primary_silver_blue: "#778DA9",
    primary_medium_blue: "#415A77",
    primary_dark_blue: "#1B263B",
    highlight_color: "#E6EAEF",
    accent_pink: "#A95666",
    accent_yellow: "#B6B55C",
    button_delete: "#C43631",
    highlight_delete: "#B4312D",
    button_edit: "#415A77",
    highlight_edit: "#3A5069",
    button_add: "#339955",
    highlight_add: "#297A44",
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: colorPallette.primary_dark_blue,
        margin: 5,
        borderRadius: 5,
        overflow: 'hidden',
    },
    header: {
        fontSize: 24,
        marginBottom: 20,
    },
});

export default React.memo(JobsMap);