InstaExport
============
InstaExport is a really simple node.js app which will export and download Instagram images based on a supplied tag name.

## Options
- `clientId` (string) - Your API client id from Instagram. __Required__.
- `tag` (string) - The tag name you want to download images for (without the #). __Required__.
- `limit` (number) - The number of items to retrieve (ordered by most recent tag date). 0 or unlimited by default.

## Usage
1. Simply clone or fork this repo to your local machine.
2. Update the app.js file options object with your Instagram API clientId and tag you want to search for.
3. Open up your favourite shell or command line and cd to the source code directory.
4. Run 'npm install' to download any dependencies.
5. Run 'node app'.
6. You should now see an images directory inside the source directory with the images in it.

## Requirements
- Your local machine needs have node.js installed.
- A valid __client id__ from the Instagram API is required, You can easily register for one on [Instagram's website](http://instagram.com/developer/register/).