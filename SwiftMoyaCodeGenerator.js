
var uri = require('/URI');
var mustache = require('./mustache');
var SwiftMoyaCodeGenerator = function() {

    this.generate = function(context) {

        var template = readFile("moya.mustache");

        var url = uri.parse(context.getCurrentRequest().url);

        var view = {
          "request": context.getCurrentRequest(),
          "baseURL": url.protocol + "://" + url.hostname,
          "pathExtension": url.path,
        };

        var query = url.query;
        if (query) {
          var fragments = query.split('&');
          var keyvalue = fragments[0].split('=');
          var queryParamsType = isNumber(keyvalue[1]) ? "Int" : "String";
          var queryParamsTemplate = "_";
          var queryParams = "let " + keyvalue[0];
          var queryDictString = "\"" + keyvalue[0] + "\": " + keyvalue[0]
          for (var i = 1; i < fragments.length; i++) {
              var keyvalue = fragments[i].split('=');
              queryParamsType += isNumber(keyvalue[1]) ? ", Int" : ", String";
              queryParamsTemplate += ", _";
              queryParams += ", let " + keyvalue[0];
              queryDictString += ", \"" + keyvalue[0] + "\": " + keyvalue[0];
          }

          view["queryParamsType"] = queryParamsType;
          view["queryParamsTemplate"] = queryParamsTemplate;
          view["queryParams"] = queryParams;
          view["queryDictString"] = queryDictString;
        }


        return mustache.render(template, view);
    }
}

function isNumber(obj) { return !isNaN(parseFloat(obj)) }

SwiftMoyaCodeGenerator.identifier = "com.kuczborski.PawExtensions.SwiftMoyaCodeGenerator";
SwiftMoyaCodeGenerator.title = "Swift (Moya)";
SwiftMoyaCodeGenerator.fileExtension = "swift";
SwiftMoyaCodeGenerator.languageHighlighter = "swift";

registerCodeGenerator(SwiftMoyaCodeGenerator);
