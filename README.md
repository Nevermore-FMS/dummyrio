# DummyRIO

This is a dirt simple application that implements the bare minimum network protocol required for the FRC Driver Station to believe it has connected to a RoboRIO. This tool is helpful when working on FMS network code without having to actually connect to a robot to tell if things are working.

## How to use

Attach an interface to your machine of 10.TE.AM.2. Then run `npm start` in this directory. The driver station will now show "Teleoperated Disabled", as if it is connected to a real robot.