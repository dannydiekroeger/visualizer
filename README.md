MUSIC VISUALIZER README
Katie Redmond, Will Han, Alex Tamplin, Danny Diekroger

Section 1: Usage Guide
Due to microphone access issues, our product is only guaranteed to run on Google Chrome. Please use Google Chrome and sorry for the inconvenience.

Instructions are provided on the site, but here are the basics:

How to run:
cd into the visualizer directory then execute the following command
python -m SimpleHTTPServer
Then in your browser go to:
localhost:8000/sound.html

or view online at deezy.herokuapp.com

Audio input:
There are two sources of possible audio input: the microphone and the playlist. At the start, it will prompt you to allow microphone access, as the microphone is the default input. If you would like to use the playlist, you can upload a song from the bottom bar, then use the adjacent buttons to control the playlist. If you want to go back to using the microphone, click the button called “microphone” on the bottom bar. 

Worlds and Key Commands:
This should be pretty self explanatory. Follow instructions on the screen to alternate between worlds, and within each world you can execute some keyboard commands for effects. Number keys switch between worlds and each world has its own commands. 

Flux’s image:
The Flux world uses an image. Controls to change this images are at the bottom. You can select one of many images, including “capture current” which instead of uploading an image takes a snapshot of the current display. This image only becomes displayed in the Flux world.


Section 2: General overview of our code setup
i. main HTML file (Sound.html)

Found in the working folder, this file contains all of the html to set up the container for the visualizer. It provides the UI to switch between scenes

ii. main sound.js file

Also found in the working folder. This file contains all of the code for the audio processing and for setting up the correct screen to display the visuals depending on the library being used. 
Individual canvases were created to house scenes. canv is for 2D rendering, canvWebGL is for 3D webgl rendering, and a specific d3 canvas is added when needed. All canvases are maintained in sound.js and each scene calls for its necessary canvas during its initial load.
This file also contains all of the processing necessary to use the webaudio API. Roughly half of the code in this file was taken from this github account https://github.com/BerlinPix/frequency-analysis-demo Basically the bare bones of microphone access and playing a song were taken from that github. The rest was written by us.

iii. individual scene js folders

Our scenes are grouped with other similar scenes and each grouping has it’s own folder. Within the folder is a javascript file for that scene as well as any supporting items necessary for the scene. Each of these individual js files contains an init function and a draw function for the scene. 
The init function is called when the scene is loaded and it does the setup necessary to create the scene. The draw function is responsible for updating the visualization with the current music data.
Each of these javascript files also contains a load function which specifies to sound.js the names of the draw and init functions to be used for the scene. If the world contains variations internally, a variable is set based on user selection.
The three function described above (load, init, and update) are required for each world. Any additional functions in the script are world specific and are only helpers for that world.

Section 3: Guide to the sound.js file
The primary function of the sound.js file is to handle all sound inputs, whether from the microphone, file input into playlist, or selecting from a fixed list of sounds. In all cases, the website uses the Web Audio API. Unfortunately, this means that our website does not work on any version of Internet Explorer, as there is no native support for the Web Audio. It does however, work on all other major browsers. To use the microphone features the app only works in browsers that support microphone access, including chrome and firefox. 
In each case, the sound.js file creates an Audio Context for the webpage. For music files, it loads the audio file into an AudioBuffer variable, containing the raw data for the audio file. The AudioContext (context) used later in the Web Audio API is linked to this AudioBuffer variable. If a microphone input is chosen, it is similarly linked to the AudioContext. The program then creates an AudioNode instance, which is used to play the audio. The AudioNode also can handle an analyser function which analyzes the audio played. Finally, the program connects the AudioNode to the AudioContext and plays and analyzes the data in the Context.
In addition to the basic webAudio sound processing, this file also includes our algorithm for detecting a beat. The source/inspiration for this algorithm is found here: http://www.airtightinteractive.com/demos/js/uberviz/audioanalysis/. 
In addition to the audio functionality, the sound.js file also initializes the canvasses for the visual effects for use later. It also handles the playlist functionality. The playlist is simply stored into an AudioBuffer array, containing multiple audio files. Clicking the next and back buttons moves to various positions in the array.



Section 3: Guide to Each Scene
i. Freq Bars -- working/mygraphics.js
	This is the most basic of the worlds. It provides a histogram where each bin corresponds to a frequency, and height corresponds to amplitude for that particular frequency. We found the basic code for this world on this guy’s Github account: https://github.com/BerlinPix/frequency-analysis-demo
This gave us a bare-bones implementation of sound analysis and we have built everything off of it.

ii. Oscillator -- oscillator/oscillator.js
	A HTML5 canvas world. We wrote all the code here. Several key commands can be used to produce effects. These key commands are detailed on the website display.
	

iii. Neon -- neon/neon.js

	Draws expanding flower shapes on each beat. The size of the circles  used to draw the flowers is based on the total amplitude of the sound. Uses the D3 library, but all code is unique. This file also contains a method called ‘get neon colors’ that is referenced by the waves world to get the same neon color scheme
D3: http://d3js.org/ 

iv. Rainbow -- rainbowLine/RainbowLine.js

A HTML5 canvas world. It is a histogram of the frequencies grouped together and averaged for less clutter. All code is uniquely written.
Utilizes a type variable to give the world more variation. Main variation is the inclusion of an identical line of rainbow dots to represent wavelength, calculated by averaging the most recent wave samples. The range of frequencies is decreased in duplicate variations to remove frequencies that are less common (or outside the average human hearing range)

v. Retro -- retroCircles/RetroCircles.js

A HTML5 canvas world. Frequencies are represented by radius of circles. All code was developed for this application.
Type variable used for variation. Available variations are: total amplitude shown in a box around circles, total amplitude shown with radial gradient, beat as a background change. 
Color pallets from http://www.colourlovers.com/blog/2009/04/16/130-retro-color-palettes 

vii. 3D Stars -- 3D/StarParts.js

Uses THREE.js library. Random circles of random color are placed on a 2D canvas.
Speed of circles towards user is calculated by total amplitude. Once the circles reach user, they return to the back of the world. Circles turn white when there is a beat. 
Inspiration from http://creativejs.com/tutorials/three-js-part-1-make-a-star-field/ Direct implimentation, color, and sound interaction is uniquely developed.

viii. 3D donuts -- 3D/Donuts.js

Uses THREE.js library. Toruses built and stacked in decreasing diameter size and rainbow color. Demonstrates camera movement. 
Two variations exist, one where toruses move independent of music and one where height of torus determined by frequency. 
Additional lighting turned on when there is a beat, seen as white light on toruses. All code is uniquely written.
Material is transparent when in frequency mode to better see toruses in the middle

ix. 3D waves -- 3D/3dWaves.js

Found in the 3D folder. This scene uses the THREE.js library. It relies specifically on the THREE.js postprocessing and shaders to give the lines a glow effect. Uses the getNeonColors method from the neon world to generate the material for the lines. The waves are a visual representation of the sound wave of the music. The effect is produced by several parrallel lines that move across the screen in the shape of the wave. This world has several different options: the Kaleido option turns on the THREE kaleido shader that distorts the shape of the lines, the Dots option turns on the THREE dots shader that adds a dot screen filter, and the rotation option allows the camera to rotate around the scene to show it from different angles. Both the kaleido and dots world rely on constants defined in the main 3d worlds file because they are subsets of this world. All code here is written by us, but the shader effects are part of the standard THREE library. The init functions for the kaleido and dot effects are in their own separate files within the 3D folder. 
Inspiration/tutorial for using shaders: http://www.airtightinteractive.com/2013/02/intro-to-pixel-shaders-in-three-js/ 
THREE.js: http://threejs.org/ 


x. Flux
	There are three files in the flux folder. flux.js provides the main implementation of the flux world. serenery.js and picksle.js contain some helper functions. The images folder contains images that flux.js uses. This world works by drawing an image on the HTML5 canvas, and then messing around with individual pixels of that image. The variety of keyboard effects are detailed on the website. Check them out! All code here is written by us.

