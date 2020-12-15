'use strict';

const fs = require('fs');

class CustomizablePageController {

  /**
   * Read one of the customizable pages and render it as html
   * @param {Object} request The express request object
   * @param {String} request.params.fileName The file name for the customizable page to be read in.
   * @param {Object} response The express response object
   * @return {*} The http response
   */
  static async read(request, response) {
    fs.readFile('customizable-pages/' + request.params.fileName, 'utf8', (err, data) => {
      if(err) {
        console.error(`Error reading customizable page "${request.params.fileName}": `, err);
        response.boom.internal(err);
      }
      else {
        response.send(data);
      }
    });
  }

  /**
   * Write to one of the customizable pages
   * @param {Object} request The express request object
   * @param {String} request.params.fileName The file name for the customizable page to write to.
   * @param {String} request.body.html The html to write to the file
   * @param {Object} response The express response object
   * @return {*} The http response
   */
  static async write(request, response) {
    fs.writeFile('customizable-pages/' + request.params.fileName, request.body.html, err => {
      if(err) {
        console.error(`Error writing to customizable page "${request.params.fileName}": `, err);
        response.boom.internal(err);
      }
      else {
        response.json({success: true});
      }
    });
  }

}

module.exports = CustomizablePageController;