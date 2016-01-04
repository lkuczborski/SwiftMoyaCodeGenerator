var uri = require('/URI');
var mustache = require('./mustache');

var SwiftMoyaCodeGenerator = function() {

    this.generate = function(context) {

        var template = readFile("moya.mustache");
        var request = context.getCurrentRequest();
        var url = uri.parse(request.url);

        var view = {
            "request": request,
            "baseURL": url.protocol + "://" + url.hostname,
            "pathExtension": url.path,
        };

        var query = url.query;
        if (query) {
            var fragments = query.split('&');
            var keyvalue = fragments[0].split('=');
            var queryParamsType = keyvalue[0] + ": " + typeForObject(keyvalue[1]);
            var queryParamsTemplate = "_";
            var queryParams = "let " + keyvalue[0];
            var queryDictString = "\"" + keyvalue[0] + "\": " + keyvalue[0]
            for (var i = 1; i < fragments.length; i++) {
                keyvalue = fragments[i].split('=');
                queryParamsType += ", " + keyvalue[0] + ": " + typeForObject(keyvalue[1]);
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

function typeForObject(obj) { return (isNumber(obj) ? "Int" : "String") }

SwiftMoyaCodeGenerator.identifier = "com.kuczborski.PawExtensions.SwiftMoyaCodeGenerator";
SwiftMoyaCodeGenerator.title = "Swift (Moya)";
SwiftMoyaCodeGenerator.fileExtension = "swift";
SwiftMoyaCodeGenerator.languageHighlighter = "swift";

registerCodeGenerator(SwiftMoyaCodeGenerator);
