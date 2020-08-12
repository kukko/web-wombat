# TemplateConnector

With `WebWombat` you can use different template engines to generate response. You can set one template engine for the whole application or a different ones for different controller classes or a different one for every controller method.

If you want to use a template engince which is currently not available in `WebWombat`, then you can easily create a template connector for that template engine by creating a class which implements the [TemplateInterface](./templateInterface.md) interface.

The currently available template connectors are the following.

## BladeConnector
This connector uses the [blade](https://www.npmjs.com/package/blade) template engine.
The current version of the template engine which is used by `WebWombat` is `3.3.1`.
## HandlebarsConnector
This connector uses the [handlebars](https://www.npmjs.com/package/handlebars) template engine.
The current version of the template engine which is used by `WebWombat` is `4.7.6`.
## HTMLConnector
This connector not uses any template engine. It is just reads in the contents of a file and doesn't do any modifications on it.
## MustacheConnector
This connector uses the [mustache](https://www.npmjs.com/package/mustache) template engine.
The current version of the template engine which is used by `WebWombat` is `3.2.1`.
## PugConnector
This connector uses the [pug](https://www.npmjs.com/package/pug) template engine.
The current version of the template engine which is used by `WebWombat` is `2.0.4`.