const __types = {
    string: "TP_STRING",
    text: "TP_TEXT",
    image: "TP_IMAGE",
    date: "TP_DATE",
    pk: "TP_PK"
};
const __visibilities = {
    visible: "TP_VISIBLE",
    hidden: "TP_HIDDEN"
};
const __class = "border-left-0 border-right-0 border-top-0 rounded-0";
const colorPick = "";
let property_common = {
    NECESSARY: 0,
    LABEL: 1,
    NAME: "",
    DEFAULT: null
};
let property_image = {
    ELEMENT: [__types.image,__visibilities.visible],
    FOLDER: "",
    VALID: "Archivo seleccionado",
    INVALID: "Archivo",
    BROWSER: "",
    ACCEPT: "image/*,video/mp4,video/x-m4v,video/*",
    SIZE: []
};
let property_order = {
    ELEMENT: [__types.string,__visibilities.visible],
    MAXLENGTH: 3,
    REQUIRED: true,
    LABEL: true,
    CLASS: `text-uppercase text-center ${__class}`,
    NAME: "orden",
    DEFAULT: null,
    HELP: "Orden alfanúmerico"
};
let property_id = {
    ELEMENT: [__types.pk,__visibilities.hidden],
    NAME: "id",
    DEFAULT: null
};
let editor_text = {
    toolbarGroups: [
        { name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
        { name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
        { name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
        { name: 'forms', groups: [ 'forms' ] },
        { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
        { name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
        { name: 'links', groups: [ 'links' ] },
        { name: 'insert', groups: [ 'insert' ] },
        { name: 'styles', groups: [ 'styles' ] },
        { name: 'colors', groups: [ 'colors' ] },
        { name: 'tools', groups: [ 'tools' ] },
        { name: 'others', groups: [ 'others' ] },
        { name: 'about', groups: [ 'about' ] }
    ],
    colorButton_colors : colorPick,
    removeButtons: '',
    height: ''
};

const __ENTITY = {
    slider: {
        NAME: "Slider",
        TABLE: "sliders",
        ATTR: {
            id: {
                ... property_id
            },
            order: {
                ... property_order
            },
            section: {
                ELEMENT: [__types.string,__visibilities.hidden],
                NAME: "sección",
                DEFAULT: null
            },
            image: {
                ... property_image,
                ... property_common,
                NECESSARY: 1,
                FOLDER: "sliders",
                ACCEPT: "image/*",
                NAME: "imagen",
                SIZE: ["1366px","486px"]
            },
            text: {
                ... property_common,
                ELEMENT: [__types.text,__visibilities.visible],
                EDITOR: 1,
                FIELDSET: 1,
                NAME: "texto"
            },
            date: {
                ... property_common,
                ELEMENT: [__types.date,__visibilities.visible],
                NAME: "fecha",
                LABEL: true
            }
        },
        COLUMN: {
            order: {
                WIDTH: "50px"
            },
            date: {
                WIDTH: "100px"
            },
            text: {
                WIDTH: "auto"
            },
            image: {
                WIDTH: "250px"
            }
        },
        FORM: [
            {
                section: "",
                image: "col-12 col-sm-7",
                date: "col-12 col-sm-5"
            },
            {
                text: "col-12 col-sm-7 col-md-9 col-xl-10",
                order: "col-12 col-sm-5 col-md-3 col-xl-2"
            },
        ],
        FUNCTION: {
            image: {
                onchange:{F:"readURL(this,'/image/')",C:"image"}
            }
        },
        EDITOR: {
            text: {
                ... editor_text,
                removeButtons: 'Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,Undo,Redo,Find,Replace,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Font,ShowBlocks,About,Blockquote',
                height: '150px'
            }
        }
    }
};