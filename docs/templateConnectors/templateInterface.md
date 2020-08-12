# TemplateInterface

All of the template connectors in `WebWombat` implements this interface. You can create a template connector for yourself by creating a class which implements the following methods.

## Methods have to be implemented

### getDefaultFileExtension()

This method have to return a string which contains the extension of files which have to been processed by this template connector.

### render(filePath, options, writeToResponse, endResponse)
This method will be called by ViewProvider when a controller wants to render a view.

**filePath**
The path of the template file which have to been processed.

## Implemented public methods

### constructor(request, response)

This is the constructor of the template connector. When `WebWombat` instantiates a template connector, it pass the request and response objects which is associated with the current request to the constructor.