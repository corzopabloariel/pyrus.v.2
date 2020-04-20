/**
 * @param e
 * @type string
 * @description entidad usada en el sistema. Definida en __ENTITY.js
 * -------------------------- /
 * - Pyrus JS -
 * Herramienta para el armado de formularios y tablas, recolección de información de
 * formularios y envío de los datos al controlador para el manejo de la información.
 * -------------------------- /
 * @requires
 * AXIOS: todos los request son por medio de axios
 * CKEDITOR: para establecer editores ricos en los formularios
 * SWEETALERT: https://sweetalert.js.org/
 * SELECTPICKER:
 * -------------------------- /
 * @version 2.0
 * @author Pablo Corzo (hola@pablocorzo.dev)
 */
class Pyrus__connect {
    static fetchData(url_api, type, data) {
        let formData = null;
        if (data.data) {
            formData = new FormData();
            for(let k in data.data)
                formData.append(k, data.data[k]);
        }
        return new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest();
            xhttp.open(type, url_api, true);
            xhttp.onreadystatechange = (() => {
                if(xhttp.readyState === 4)
                {
                    (xhttp.status === 200)
                        ? resolve(JSON.parse(xhttp.responseText))
                        : reject(new Error('Error', url_api))
                }
            });
            if (data.header) {
                for (let k in data.header)
                    xhttp.setRequestHeader(k, data.header[k])
            }
            xhttp.send(formData);
        })
    }
    static async post(url_api, data = null) {
        return await this.fetchData(url_api, "POST", data);
    }
    static async get(url_api, data = null) {
        return await this.fetchData(url_api, "GET", data);
    }
}
class Pyrus {
    /* Property */
    #entity         = null;
    #container      = null;
    #name           = null;
    #specification  = null;
    #tableDB        = null;
    #object         = null;
    #simple         = null;
    #empty          = null;
    #column         = null;
    #form           = null;
    #ids            = {table: null};
    method          = null;
    /* /Property */

    /**
     * @param {String} e
     */
    constructor(e) {
        //try {
            if (!e) {
                console.warn(`AVISO: No se ha pasado ninguna entidad. Uso limitado`);
                return false;
            }
            this.#entity = e.e;
            this.#container = document.querySelector(`${e.el.c}`);
            console.time("Load");
            /* ------------------- */
            if (__ENTITY[ this.#entity ] === undefined) {
                console.warn(`AVISO: Entidad "${this.#entity}" no encontrada`);
                return false;
            }
            this.#object = __ENTITY[ this.#entity ];
            this.#name = this.#object.NAME === undefined ? this.#entity : this.#object.NAME;
            this.#tableDB = this.#object.TABLE === undefined ? this.#entity : this.#object.TABLE;
            /* ------------------- */
            this.#getSpecification();
            this.#getSimple();
            this.#getEmpty();
            this.#getColumn();
            this.#getForm();
            /* ------------------- */
            if (e.method)
                this.method = e.method;
            /* ------------------- */
            if (e.el.f)
                this.form();
            if (e.el.t)
                this.table();
            console.timeEnd("Load");
        /*} catch (error) {
            console.error(error);
        }*/
    }

    static elements() {
        return console.table(window.pyrus_elements);
    }
    /**
     * @property {String} u
     */
    static url(u) {
        window.url__pyrus = u;
        if (!sessionStorage.token) {
            Pyrus__connect.post(`${window.url__pyrus}oauth/token`, {
                data: {
                    grant_type: 'client_credentials',
                    client_id: 3,
                    client_secret: 'c5MA5h3v05rob3c8WTrQKnIroluv1t2DrnjTVJ4Z'
                }
            })
            .then(response => {
                sessionStorage.setItem("token", JSON.stringify(response))
            })
            .catch(error => {
                console.error(error);
            });
        }
    }
    /**
     * @property {String} u
     */
    static folder(f) {
        window.folder__pyrus = f;
    }
    /**
     * GET PROPERY
     */
    get entity() {
        return this.#entity;
    }
    get name() {
        return this.#name;
    }
    get container() {
        return this.#container;
    }
    get tableDB() {
        return this.#tableDB;
    }
    get empty() {
        return {...this.#empty};
    }
    get ids() {
        return this.#ids;
    }

    /**
     * @returns null
     * @description Obtiene la especificación de cada entidad
     */
    #getSpecification = () => {
        this.#specification = {};
        for (let property in this.#object.ATTR) {
            let { ELEMENT } = this.#object.ATTR[property];
            this.#specification[property] = {
                ... this.#object.ATTR[property],
                TYPE: "",
                VISIBILITY: ""
            };
            delete this.#specification[property].ELEMENT;
            for (let visibility in __visibilities) {
                if (ELEMENT.indexOf(__visibilities[visibility]) >= 0) {
                    this.#specification[property].VISIBILITY = __visibilities[visibility];
                    break;
                }
            }
            for (let type in __types) {
                if (ELEMENT.indexOf(__types[type]) >= 0) {
                    this.#specification[property].TYPE = __types[type];
                    break;
                }
            }
        }
    };
    /**
     * @returns null
     * @description Genera elemento simple para procesar en el controlador
     */
    #getSimple = () => {
        this.#simple = {};
        this.#simple.table = this.table;
        this.#simple.specification = {};
        this.#simple.details = {};
        for (let property in this.#specification) {
            if (this.#specification[property].HIDDEN !== undefined)
                continue;
            this.#simple.specification[property] = this.#specification[property].TYPE;
            switch (this.#specification[property].TYPE) {
                case "TP_FILE":
                case "TP_IMAGE":
                case "TP_BLOB":
                    this.#simple.details[property] = {
                        FOLDER: this.#specification[property].FOLDER === undefined ? this.#name : this.#specification[property].FOLDER
                    };
                    break;
                case "TP_CAST":
                    this.#simple.details[property] = {
                        CAST: this.#specification[property].CAST === undefined ? null : this.#specification[property].CAST
                    };
                    break;
                case "TP_PASSWORD":
                    this.#simple.details[property] = {
                        PASSWORD: 1
                    };
                    break;
            }
        }
    };
    /**
     * @returns null
     * @description Genera un objeto
     */
    #getEmpty = () => {
        this.#empty = {};
		for (let property in this.#specification)
            this.#empty[ property ] = this.#specification[property].DEFAULT;
    };
    /**
     * @returns null
     * @description Obtenemos CSS necesarios para el formulario
     */
    #getForm = () => {
        this.#form = {};
        for (let property in this.#specification) {
            if (this.#specification[property].TYPE == "TP_PK")
                continue;
            if (this.#specification[property].VISIBILITY == "TP_VISIBLE_TABLE" )
                continue;
            this.#form[property] = {
                ...this.#specification[property],
                NAME: this.#specification[property].NAME
            }
            if (this.#object.FUNCTION !== undefined) {
                if (this.#object.FUNCTION[property] !== undefined)
                    this.#form[property].FUNCTION = this.#object.FUNCTION[property];
            }
        }
    }
    /**
     * @returns null
     * @description Construye ARRAY de elementos de la cabecera de la tabla
     */
    #getColumn = () => {
        let width_;
        let name_;
        this.#column = [];
        if (this.#object.COLUMN === undefined) {
            for (let property in this.#specification) {
                if (this.#specification[property].TYPE == "TP_PK")
                    continue;
                if (this.#specification[property].VISIBILITY != "TP_VISIBLE" && this.#specification[property].VISIBILITY != "TP_VISIBLE_TABLE" )
                    continue;
                width_ = "auto";
                name_ = property.toUpperCase();
                if (this.#specification[property].NAME !== undefined)
                    name_ = this.#specification[property].NAME.toUpperCase();
                if (this.#specification[property].WIDTH !== undefined && this.#specification[property].TABLE === undefined)
                    width_ = this.#specification[property].WIDTH;
                else {
                    if (this.#specification[property].TABLE !== undefined)
                        width_ = this.#specification[property].TABLE;
                }
                this.#column.push({ NAME: name_, COLUMN: property, WIDTH: width_});
            }
        } else {
            for (let property in this.#object.COLUMN) {
                if (this.#specification[property] === undefined)
                    continue;
                if (this.#specification[property].TYPE == "TP_PK")
                    continue;
                if (this.#specification[property].VISIBILITY != "TP_VISIBLE" && this.#specification[property].VISIBILITY != "TP_VISIBLE_TABLE" )
                    continue;
                width_ = this.#object.COLUMN[property].WIDTH === undefined ? "auto" : this.#object.COLUMN[property].WIDTH;
                name_ = property.toUpperCase();
                if (this.#specification[property].NAME !== undefined)
                    name_ = this.#specification[property].NAME.toUpperCase();
                this.#column.push({ NAME: name_, COLUMN: property, WIDTH: width_});
            }
        }
    };
    /**
     * @property {Object} table_container
     */
    #buildTable = table_container => {
        let element = document.createElement("TABLE");
        let element_head = element.createTHead();
        let element_head_tr = document.createElement("TR");
        let element_body = document.createElement("TBODY");
        let element_body_tr = document.createElement("TR");
        element.classList.add("table", "table-hover", "mb-0");
        element_head.appendChild(element_head_tr);
        element_body.appendChild(element_body_tr);
        element.appendChild(element_head);
        element.appendChild(element_body);
        table_container.appendChild(element);

        for(let column of this.#column) {
            let th = document.createElement("TH");
            th.textContent = column.NAME;
            th.setAttribute("style", `width:${column.WIDTH};`);
            th.classList.add("text-center");
            element_head_tr.appendChild(th);
        }
        let th = document.createElement("TH");
        th.textContent = "-";
        th.setAttribute("style", `width:100px;`);
        th.classList.add("text-center");
        element_head_tr.appendChild(th);

        let img = document.createElement("IMG");
        img.setAttribute("src",`${window.url__pyrus}${window.folder__pyrus}/${Pyrus.name.toLowerCase()}/puff.svg`);
        img.setAttribute("style", "filter:invert(1)");
        let td = document.createElement("TD");
        td.setAttribute("colspan", this.#column.length + 1);
        td.appendChild(img);
        td.classList.add("text-center");
        element_body_tr.appendChild(td);

        this.#dataBase(element_body, element_body_tr);
    };
    /**
     * @property {Object} body
     * @property {Object} tr_first
     */
    #dataBase = (body, tr_first) => {
        const token = JSON.parse(sessionStorage.token);
        this.post();
        Pyrus__connect.get(`${window.url__pyrus}api/${this.#tableDB}`,
            {
                header: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    Authorization: `${token.token_type} ${token.access_token}`
                }
            })
        .then(response => {
            if (response) {
                if (Object.keys(response).length > 0)
                    tr_first.remove();
                else
                    tr_first.querySelector("td").textContent = "- Sin registros -";
            }
        })
        .catch(error => {
            console.log(error);
        });
    };
    /**
     * @param {Object} form_container
     * @param {String} name
     * @param {Boolean} multiple
     */
    #buildForm = (form_container, name, multiple) => {
        const form = this.#object.FORM === undefined ? null : this.#object.FORM;
        let element_id = Date.now();
        if (!form) {
            for (let property in this.#form) {
                element_id ++;
                let div_row = document.createElement("DIV");
                div_row.classList.add("row","justify-content-center");
                div_row.setAttribute("id",`${this.#ids.form}-${element_id}`);
                window.pyrus_elements.push({id:`${this.#ids.form}-${element_id}`,element: div_row});

                let div_col = document.createElement("DIV");
                div_col.classList.add("col-12");
                let names = this.#names(property, name, multiple);
                let element = this.#suitableItem(this.#form[property], names);
                if (!!element)
                    div_col.appendChild(element)
                div_row.appendChild(div_col);
                form_container.appendChild(div_row);
            }
        } else {
            for (let row of form) {
                let div_row = document.createElement("DIV");
                div_row.classList.add("row","justify-content-center");
                div_row.setAttribute("id",`${this.#ids.form}-${element_id}`);
                element_id ++;
                window.pyrus_elements.push({id:`${this.#ids.form}-${element_id}`,element: div_row});
                for (let property in row) {
                    if (this.#form[property] === undefined) {
                        console.error(`Property "${property}" not found`);
                        break;
                    }
                    let div_col = document.createElement("DIV");
                    if (!!row[property])
                        div_col.classList.add(...row[property].split(" "));
                    let names = this.#names(property, name, multiple);
                    let element = this.#suitableItem(this.#form[property], names);
                    if (!!element)
                        div_col.appendChild(element)
                    div_row.appendChild(div_col);
                }
                form_container.appendChild(div_row);
            }
        }
    };
    /**
     * @param {String} property
     * @param {String} name
     * @param {Boolean} multiple
     * @returns {JSON}
     */
    #names = (property, name, multiple) => {
        let names = {name:null, id:null};
        names.name = `${this.#entity}_${property}`;
        names.id = `${this.#entity}_${property}`;
        if (name !== null) {
            names.name += `_${name}`;
            names.id += `_${name}`;
        }
        if (multiple) {
            if (window[`${this.#entity}_${property}`] === undefined)
                window[`${this.#entity}_${property}`] = 0;
            window[`${this.#entity}_${property}`] ++;
            names.name += `[]`;
            names.id += `_${window[`${this.#entity}_${property}`]}`;
        }
        return names;
    };
    /**
     * @param {JSON} element
     * @param {JSON} names
     * @returns {Object}
    */
    #suitableItem = (element, names) => {
        if (element.VISIBILITY == 'TP_VISIBLE' || element.VISIBILITY == 'TP_VISIBLE_FORM' ) {
            switch (element.TYPE) {
                case "TP_STRING":
                    return this.#input(element, names, "text");
                case "TP_LINK":
                    return this.#input(element, names, "url");
                case "TP_PHONE":
                    return this.#input(element, names, "phone");
                case "TP_EMAIL":
                    return this.#input(element, names, "email");
                case "TP_NUMBER":
                    return this.#inputNumber(element, names);
                case "TP_DATE":
                    return this.#inputDate(element, names);
                case "TP_TEXT":
                    return this.#textarea(element, names);
                case "TP_IMAGE":
                    return this.#image(element, names);
                case "TP_PASSWORD":
                    return this.#input(element, names, "password");
                case "TP_SELECT":
                    return this.#select(element, names);
                default:
                    return this.#input(element, names, "text");
            }
        }
        else
            return this.#inputHidden(element, names);
    };
    /** ITEMS */
    /**
     * @param {JSON} element
     * @param {Object} container
     * @param {Object} object
     * @param {JSON}
     */
    #appendLabelHelpFunction = (element, container, object, names, functions = true) => {
        if (element.LABEL) {
            let label = document.createElement("LABEL");
            label.htmlFor = names.id;
            label.textContent = element.NAME;
            container.appendChild(label);
        }
        container.appendChild(object);
        if (element.HELP !== undefined) {
            let small = document.createElement("SMALL");
            small.classList.add("form-text","text-muted");
            small.textContent = element.HELP;
            container.appendChild(small);
        }
        if (element.FUNCTION && functions) {
            for(let _function in element.FUNCTION)
                object.setAttribute(_function, element.FUNCTION[_function]);
        }
    };
    /**
     * @param {JSON} element
     * @param {JSON} object
     */
    #attrInput = (element, object) => {
        if (element.CLASS != null)
            object.classList.add(...element.CLASS.split(" "));
        if (element.REQUIRED)
            object.required = true;
        if (element.DISABLED)
            object.disabled = true;
        if (element.READONLY)
            object.readOnly = true;
    };
    /**
     * @param {JSON} element
     * @param {JSON} names
     * @param {String} type
     */
    #input = (element, names, type) => {
        let object = document.createElement("INPUT");
        let container = document.createElement("DIV");
        container.classList.add("form-group");
        object.setAttribute("type", type);
        if (element.CLASS === undefined)
            element.CLASS = "form-control";
        else
            element.CLASS += " form-control";
        switch (type) {
            case "number":
                //object.setAttribute("type", "text");
                element.CLASS += " input-numero text-right";
                element.PATTERN = "[0-9]";
            break;
            case "password":
                //(?=.*\d)(?=.*[a-z])(?=.*[A-Z])
                element.CLASS += " input-password";
                element.PATTERN = ".{6,}";
            break;
            case "text":
                element.CLASS += " input-text";
                element.PATTERN = "[A-Za-z]";
            break;
            case "email":
                element.CLASS += " input-email";
                element.PATTERN = "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}";
                break;
            case "url":
                element.CLASS += " custom-file-input invalid";
                element.PATTERN = "https?://.+";
                break;
            default:
                element.CLASS += " input-text";
                element.PATTERN = "[A-Za-z]";
        }
        object.setAttribute("pattern",element.PATTERN);
        this.#attrInput(element, object);
        object.placeholder = element.PLACEHOLDER !== undefined ? element.PLACEHOLDER : element.NAME;
        object.setAttribute("aria-label", element.NAME);
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        this.#appendLabelHelpFunction(element, container, object, names);
        return container;
    };
    /**
     * @param {JSON} element
     * @param {JSON} names
     */
    #inputNumber = (element, names) => {
        let object = document.createElement("INPUT");
        let container = document.createElement("DIV");
        container.classList.add("form-group");
        if (element.CLASS === undefined)
            element.CLASS = "form-control text-right";
        else
            element.CLASS += " form-control text-right";
        this.#attrInput(element, object);
        if (element.MIN)
            object.setAttribute("min", element.MIN);
        if (element.MAX)
            object.setAttribute("max", element.MAX);
        if (element.DEFAULT)
            object.value = element.DEFAULT;
        object.setAttribute("type", "number");
        object.setAttribute("aria-label", element.NAME);
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        this.#appendLabelHelpFunction(element, container, object, names);
        return container;
    };
    /**
     * @param {JSON} element
     * @param {JSON} names
     */
    #inputDate = (element, names) => {
        let object = document.createElement("INPUT");
        let container = document.createElement("DIV");
        container.classList.add("form-group");
        if (element.CLASS === undefined)
            element.CLASS = "form-control text-right";
        else
            element.CLASS += " form-control text-right";
        this.#attrInput(element, object);
        object.setAttribute("type", "date");
        object.setAttribute("aria-label", element.NAME);
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        this.#appendLabelHelpFunction(element, container, object, names);
        return container;
    };
    /**
     * @param {JSON} element
     * @param {JSON} names
     */
    #inputHidden = (element, names) => {
        let object = document.createElement("INPUT");
        object.setAttribute("type", "hidden");
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        return object;
    };
    /**
     * @param {JSON} element
     * @param {JSON} names
     */
    #textarea = (element, names) => {
        let object = document.createElement("TEXTAREA");
        let container = document.createElement("DIV");
        container.classList.add("form-group");
        if (element.CLASS === undefined)
            element.CLASS = "form-control";
        else
            element.CLASS += " form-control";
        this.#attrInput(element, object);
        object.placeholder = element.PLACEHOLDER !== undefined ? element.PLACEHOLDER : element.NAME;
        object.setAttribute("aria-label", element.NAME);
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        this.#appendLabelHelpFunction(element, container, object, names);
        return container;
    };
    /**
     * @param {JSON} element
     * @param {JSON} names
     */
    #image = (element, names) => {
        let file = document.createElement("DIV");
        let container = file.cloneNode(true);
        let images = file.cloneNode(true);
        let object = document.createElement("INPUT");
        let input = object.cloneNode(true);
        let label = document.createElement("LABEL");
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        let svgimg = document.createElementNS('http://www.w3.org/2000/svg','image');
        container.classList.add("form-group");
        svgimg.setAttributeNS(null,"height","170");
        svgimg.classList.add("w-100");
        svgimg.setAttribute("id", `image-${names.id}`)
        svgimg.setAttributeNS("http://www.w3.org/1999/xlink","href", __img_not_found);
        svgimg.setAttributeNS(null,"x","0");
        svgimg.setAttributeNS(null,"y","0");
        svgimg.setAttributeNS(null, "visibility", "visible");
        rect.setAttribute("fill", "#868e96");
        rect.setAttribute("height", "170");
        rect.classList.add("w-100");
        svg.setAttribute("aria-label", "Placeholder: Imagen");
        svg.setAttribute("height", "170");
        svg.classList.add("w-100");
        svg.appendChild(rect);
        svg.appendChild(svgimg);

        file.classList.add("custom-file");
        label.setAttribute("data-invalid",element.NAME);
        label.classList.add("custom-file-label", "mb-0", "text-truncate");
        label.htmlFor = names.id;
        label.setAttribute("data-invalid",`${element.NAME} ${element.INVALID}`);
        label.setAttribute("data-valid",`${element.NAME} ${element.VALID}`);
        label.setAttribute("data-browse",`${element.BROWSER}`);
        input.setAttribute("type", "hidden");
        input.classList.add("imgURL");
        input.setAttribute("name", `hidden_${names.name}`);
        input.setAttribute("id", `hidden_${names.id}`);
        object.setAttribute("type", "file");
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        for(let _function in element.FUNCTION)
            object.setAttribute(_function, element.FUNCTION[_function]);
        file.appendChild(object);
        file.appendChild(label);
        file.appendChild(input);

        images.appendChild(svg);
        images.appendChild(file);
        this.#appendLabelHelpFunction(element, container, images, names, false);
        return container;
    };
    /**
     * @param {JSON} element
     * @param {JSON} names
     */
    #select = (element, names) => {
        let object = document.createElement("SELECT");
        let container = document.createElement("DIV");
        container.classList.add("form-group");
        if (element.CLASS === undefined)
            element.CLASS = "form-control";
        else
            element.CLASS += " form-control";
        if (element.MULTIPLE === undefined)
            element.MULTIPLE = false;
        if (element.CLASS != null)
            object.classList.add(...element.CLASS.split(" "));
        if (element.REQUIRED)
            object.required = true;
        if (element.DISABLED)
            object.disabled = true;
        if (element.READONLY)
            object.readOnly = true;
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        object.setAttribute("data-live-search",true);
        object.setAttribute("data-width","100%");
        object.setAttribute("data-container","body")
        if (element.MULTIPLE)
            object.multiple = true;
        /** OPTIONS */
        if (element.OPTION) {
            for (let opt of element.OPTION) {
                let option = document.createElement("OPTION");
                option.text = opt._t;
                option.value = opt._v;
                object.options.add(option, 1);
            }
        }
        /** /OPTIONS */
        this.#appendLabelHelpFunction(element, container, object, names);
        return container;
    };
    table = () => {
        let table_element = document.querySelector(`table-pyrus-${this.entity}`);
        if (!table_element) {
            table_element = document.createElement(`table-pyrus-${this.entity}`);
            table_element.setAttribute("id",`table-pyrus-${this.entity}`);
            this.container.appendChild(table_element);
        }
        this.ids.table = `table-pyrus-${this.entity}`;
        createClass(`table-pyrus-${this.entity}`,"display: block;");
        this.#buildTable(table_element);
    };
    form = (name = null, multiple = false) => {
        let form_element = document.querySelector(`form-pyrus-${this.#entity}`);
        this.#ids.form = `form-pyrus-${this.#entity}`;
        if (!form_element) {
            form_element = document.createElement(`form-pyrus-${this.#entity}`);
            form_element.setAttribute("id",`form-pyrus-${this.#entity}`);
            this.#container.appendChild(form_element);
        }
        createClass(`form-pyrus-${this.#entity}`,"display: block;");
        this.#buildForm(form_element, name, multiple);
    };
};

Pyrus.prototype.post = function() {
    const origin = this.method.post;
    origin.call(this, arguments);
    console.log(this.element)
}
