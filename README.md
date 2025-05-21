# Digital Lift Consulting Components and Code Snippets
A few components we (Justin Donaldson &amp; Grant Macmillan) are proud to share with the community. These are item's we've built as parts of larger projects.

## React-Native-Components 
contains a few of our modular (and not so modular) components developed over our careers that we are eager to share with the public.
- Buttons contains a number of custom styled buttons that accept a function and will fire it when clicked. Note these use the <Pressable> component which may be depracated depending on when this is viewed.
- Jobs Map Component: This component is a Static Google Map that can take in a number of addresses. Our component use's a firebase function to generate the lat/long for the addresses however this can be replaced by a user's own function.
- Punch Clock Button: The first component written by Justin Donaldson using React-Native, this functions as a communication and Authorization point for a larger system. The code itself is fairly long and repetitive and can be improved significantly with more work. It requires communication with a few systems such as Firebase and Async-Storage.
- Date/Time Picker: A custom built Calendar selection system produced by [Grant MacMillan](https://github.com/grantmacmillan). Due to a number of build error's we received from other libraries that provided similar functionality, we decided to develop our own Date and Time selection component. Although not as Flexible or stylish as other libraries, this system is built entirely on the React-Native framework and compiles without error.
