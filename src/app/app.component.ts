import { Component, ViewChild, AfterViewInit } from '@angular/core';
import YAML from 'yaml'
import Ajv from 'ajv';
@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  name = 'Dynaflow YAML Editor';
  @ViewChild('editor') editor;
  schema : any = {
    "title": "Person",
    "type": "object",
    "properties": {
      "name": {
        "type": "string",
        "description": "First and Last name",
        "minLength": 4,
        "default": "Jeremy Dorn"
      },
      "age": {
        "type": "integer",
        "default": 25,
        "minimum": 18,
        "maximum": 99
      },
      "favorite_color": {
        "type": "string",
        "title": "favorite color",
        "default": "#ffa500"
      },
      "gender": {
        "type": "string",
        "enum": [
          "male",
          "female"
        ]
      },
      "location": {
        "type": "object",
        "title": "Location",
        "properties": {
          "city": {
            "type": "string",
            "default": "San Francisco"
          },
          "state": {
            "type": "string",
            "default": "CA"
          },
          "citystate": {
            "type": "string",
            "description": "This is generated automatically from the previous two fields",
            "template": "{{city}}, {{state}}",
            "watch": {
              "city": "location.city",
              "state": "location.state"
            }
          }
        }
      },
      "pets": {
        "type": "array",
        "title": "Pets",
        "uniqueItems": true,
        "items": {
          "type": "object",
          "title": "Pet",
          "properties": {
            "type": {
              "type": "string",
              "enum": [
                "cat",
                "dog",
                "bird",
                "reptile",
                "other"
              ],
              "default": "dog"
            },
            "name": {
              "type": "string"
            }
          }
        },
        "default": [
          {
            "type": "dog",
            "name": "Walter"
          }
        ]
      }
    }
  };
  errors:any = [];
  ngAfterViewInit() {

    this.editor.getEditor().setOptions({
      showLineNumbers: true,
      tabSize: 2
    });

    this.editor.mode = 'yaml';
    this.editor.value = `
name: json jon
age: 20
favorite_color: "#ffa500"
gender: male
location:
  city: San Francisco
  state: CA
  citystate: San Francisco, CA
pets:
- type: dog
  name: Walter
`

    this.editor.getEditor().commands.addCommand({
      name: "showOtherCompletions",
      bindKey: "Ctrl-.",
      exec: function (editor) {

      }
    })

    this.editor.getEditor().on("change", (output) => {
      console.log(output);
     this.getValue();
    })
    this.editor.getEditor().on("paste", (output) => {
      console.log(output);
     this.getValue();
    })
  }

  getValue() {
    console.log(this.editor.value)
    // console.log(eval(this.editor.value));
    const json = YAML.parse(this.editor.value);
    var ajv = new Ajv();
    var valid = ajv.validate(this.schema, json);
if (!valid) { console.log(ajv.errors);
this.errors = ajv.errors;
}
else {
  this.errors = [];
  console.log("Success")
}
  }
}
