# Simulating the Melting of Ice Caps

This is an adaptation of the [Simulating the Melting of Ice Caps](https://imaginary.org/program/simulating-the-melting-of-ice-caps) 
application by Maëlle Nodet (University Grenoble Alpes) and Jocelyne Erhel (Inria) for use in IMAGINARY exhibitions.

## Limitations

**IMPORTANT**:

Currently this app only supports 16:9 screens (e.g. 1920x1080) and nearby aspect ratios. Layout will break at
other aspect ratios and small resolutions. Hopefully they will be eventually supported. 

## Configuration

Configure the system by editing the cfg/config.yml file. There are important settings for running the exhibit 
in kiosk mode.

The configuration file is fully commented.

## Compilation

This app is built using several compilable languages:

- The HTML pages are built from **pug** template files.
- The CSS stylesheet is pre-compiled from **sass** files.
- The JS scripts are trans-compiled from **es6** (ES2015) files. 

To make any modifications re-compilation is necessary. You should install:

- **node** and **npm**
- **yarn**
- **gulp** (install globally)

Afterwards run the following in the command line:

```
yarn
```

After it runs succesfuly you can compile as needed:

- **sass (stylesheets)**
  ```
    gulp sass
  ```
  
- **pug (HTML pages)**
  ```
    gulp pug
  ```

- **scripts (ES6)**
  ```
    gulp scripts:prod
  ```
  
- **scripts (ES6, debug)**
  ```
    gulp scripts:dev
  ```

## Credits

Concept, content and original version by Maëlle Nodet (University Grenoble Alpes) and Jocelyne Erhel (Inria)

Graphic Design by Victoria Denys with adaptations for exhibition use by IMAGINARY.

New code by [Eric Londaits](eric.londaits@imaginary.org) for IMAGINARY.

## License

Content (including images, videos and text) licensed under [CC BY-NC-SA-3.0](http://creativecommons.org/licenses/by-nc-sa/3.0/)   

Source code and technical documentation licensed under the Apache [License](LICENSE.md).
See the [Notice](NOTICE.md) for license information of included 
dependencies.

None of the original source code was used in this adaptation.

