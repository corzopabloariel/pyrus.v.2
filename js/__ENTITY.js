const __types = {
    string: "TP_STRING",
    text: "TP_TEXT",
    link: "TP_LINK",
    number: "TP_NUMBER",
    phone: "TP_PHONE",
    email: "TP_EMAIL",
    select: "TP_SELECT",
    password: "TP_PASSWORD",
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
                LABEL: true,
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
            },
            select: {
                ... property_common,
                ELEMENT: [__types.select,__visibilities.visible],
                NAME: "selector",
                LABEL: true,
                MULTIPLE: true,
                OPTION: [
                    {_v: 1, _t: "Texto"},
                    {_v: 2, _t: "Texto 2"}
                ]
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
            {
                select: "col-12 col-sm-7 col-md-9 col-xl-10"
            }
        ],
        FUNCTION: {
            image: {
                change: "readURL(this)"
            }
        },
        EDITOR: {
            text: {
                ... editor_text,
                removeButtons: 'Save,NewPage,Preview,Print,Templates,Cut,Copy,Paste,Undo,Redo,Find,Replace,Scayt,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,CopyFormatting,RemoveFormat,CreateDiv,BidiLtr,BidiRtl,Language,Anchor,Flash,HorizontalRule,Smiley,SpecialChar,PageBreak,Iframe,Styles,Font,ShowBlocks,About,Blockquote',
                height: '150px'
            }
        }
    },

    client: {
        NAME: "Client",
        TABLE: "personas",
        ATTR: {
            id: {
                ... property_id
            },
            name: {
                ... property_common,
                ELEMENT: [__types.string,__visibilities.visible],
                NAME: "Nombre",
                MIN: 5,
                LABEL: true
            },
            last_name: {
                ... property_common,
                ELEMENT: [__types.string,__visibilities.visible],
                NAME: "Apellido",
                LABEL: true
            },
            email: {
                ... property_common,
                ELEMENT: [__types.email,__visibilities.visible],
                NAME: "Email",
                LABEL: true
            },
            number: {
                ... property_common,
                ELEMENT: [__types.number,__visibilities.visible],
                NAME: "Nro. de agendas",
                LABEL: true,
                MIN: 1,
                MAX: 10,
                DEFAULT: 1
            },
            password: {
                ... property_common,
                ELEMENT: [__types.password,__visibilities.visible],
                NAME: "Contraseña",
                LABEL: true
            }
        },
        COLUMN: {
            last_name: {
                WIDTH: "150px"
            },
            name: {
                WIDTH: "100px"
            },
            email: {
                WIDTH: "auto"
            },
            number: {
                WIDTH: "200px"
            },
            password: {
                WIDTH: "100px"
            }
        },
        FORM: [
            {
                name: "col-12 col-sm-6",
                last_name: "col-12 col-sm-6"
            },
            {
                number: "col-12 col-sm-6",
                password: "col-12 col-sm-6"
            },
            {
                email: "col-12"
            }
        ]
    }
};