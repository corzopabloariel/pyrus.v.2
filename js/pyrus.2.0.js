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
 * -------------------------- /
 * @version 2.0
 * @author Pablo Corzo (hola@pablocorzo.dev)
 */
const id = document.getElementById.bind(document);
class Pyrus {
    /* Property */
    #entity         = null;
    #name           = null;
    #specification  = null;
    #table          = null;
    #object         = null;
    #simple         = null;
    #empty          = null;
    #column         = null;
    #form           = null;
    #ids            = {table: null};
    /* /Property */

    constructor(e = null, elements = null) {
        this.#entity = e;

        if (this.#entity === null || this.#entity === "")
        {
            console.warn(`AVISO: No se ha pasado ninguna entidad. Uso limitado`);
            return false;
        }
        console.time("Load");
        /* ------------------- */
        if(__ENTITY[ this.#entity ] === undefined)
        {
            console.warn(`AVISO: Entidad "${this.#entity}" no encontrada`);
            return false;
        }
        this.#object = __ENTITY[ this.#entity ];
        this.#name = this.#object.NAME === undefined ? this.#entity : this.#object.NAME;
        this.#table = this.#object.TABLE === undefined ? this.#entity : this.#object.TABLE;
        /* ------------------- */
        this.#getSpecification();
        this.#getSimple();
        this.#getEmpty();
        this.#getColumn();
        this.#getForm();
        console.timeEnd("Load");
    }

    /**
     * GET PROPERY
     */
    get name() {
        return this.#name;
    }
    get table() {
        return this.#table;
    }
    get empty() {
        return this.#empty;
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
        for (let property in this.#object.ATTR)
        {
            let { ELEMENT } = this.#object.ATTR[property];
            this.#specification[property] = {
                ... this.#object.ATTR[property],
                TYPE: "",
                VISIBILITY: ""
            };
            delete this.#specification[property].ELEMENT;
            for(let visibility in __visibilities)
            {
                if (ELEMENT.indexOf(__visibilities[visibility]) >= 0)
                {
                    this.#specification[property].VISIBILITY = __visibilities[visibility];
                    break;
                }
            }
            for(let type in __types)
            {
                if (ELEMENT.indexOf(__types[type]) >= 0)
                {
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
        for(let property in this.#specification)
        {
            if (this.#specification[property].HIDDEN !== undefined)
                continue;
            this.#simple.specification[property] = this.#specification[property].TYPE;
            switch (this.#specification[property].TYPE)
            {
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
		for(let property in this.#specification)
            this.#empty[ property ] = this.#specification[property].DEFAULT;
    };
    /**
     * @returns null
     * @description Obtenemos CSS necesarios para el formulario
     */
    #getForm = () => {
        this.#form = {};
        for(let property in this.#specification)
        {
            if(this.#specification[property].TYPE == "TP_PK")
                continue;
            if(this.#specification[property].VISIBILITY == "TP_VISIBLE_TABLE" )
                continue;
            this.#form[property] = {
                ...this.#specification[property],
                NAME: this.#specification[property].NAME.toLocaleUpperCase()
            }
            if(this.#object.FUNCTION !== undefined)
            {
                if(this.#object.FUNCTION[property] !== undefined)
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
        if(this.#object.COLUMN === undefined)
        {
            for(let property in this.#specification)
            {
                if(this.#specification[property].TYPE == "TP_PK")
                    continue;
                if(this.#specification[property].VISIBILITY != "TP_VISIBLE" && this.#specification[property].VISIBILITY != "TP_VISIBLE_TABLE" )
                    continue;
                width_ = "auto";
                name_ = property.toUpperCase();
                if(this.#specification[property].NAME !== undefined)
                    name_ = this.#specification[property].NAME.toUpperCase();
                if(this.#specification[property].WIDTH !== undefined && this.#specification[property].TABLE === undefined)
                    width_ = this.#specification[property].WIDTH;
                else {
                    if(this.#specification[property].TABLE !== undefined)
                        width_ = this.#specification[property].TABLE;
                }
                this.#column.push({ NAME: name_, COLUMN: property, WIDTH: width_});
            }
        }
        else
        {
            for(let property in this.#object.COLUMN)
            {
                if(this.#specification[property] === undefined)
                    continue;
                if(this.#specification[property].TYPE == "TP_PK")
                    continue;
                if(this.#specification[property].VISIBILITY != "TP_VISIBLE" && this.#specification[property].VISIBILITY != "TP_VISIBLE_TABLE" )
                    continue;
                width_ = this.#object.COLUMN[property].WIDTH === undefined ? "auto" : this.#object.COLUMN[property].WIDTH;
                name_ = property.toUpperCase();
                if(this.#specification[property].NAME !== undefined)
                    name_ = this.#specification[property].NAME.toUpperCase();
                this.#column.push({ NAME: name_, COLUMN: property, WIDTH: width_});
            }
        }
    };
    /**
     * @property id_container (string) ID del contenedor donde se construirá la tabla
     */
    #getTable = id_container => {
        const table_container = id(id_container);
        let element = document.createElement("TABLE");
        element.setAttribute("id", this.#ids.table);
        let element_head = element.createTHead();
        let element_head_tr = document.createElement("TR");
        let element_body = document.createElement("TBODY");
        let element_body_tr = document.createElement("TR");
        element.classList.add("table", "table-striped", "table-hover", "table-borderless", "mb-0");
        element_head.classList.add("thead-dark");
        element_head.appendChild(element_head_tr);
        element_body.appendChild(element_body_tr);
        element.appendChild(element_head);
        element.appendChild(element_body);
        table_container.appendChild(element);

        for(let column of this.#column)
        {
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

        let td = document.createElement("TD");
        td.setAttribute("colspan", this.#column.length + 1);
        td.textContent = "- Sin registros -";
        td.classList.add("text-center");
        element_body_tr.appendChild(td);

        window.TableTrFirst = element_body_tr;
    };
    table = (id_container = "table-container") => {
        this.#ids.table = `table-container-${this.#entity}`;
        this.#getTable(id_container);
    };
    /**
     * @property id_container (string) ID del contenedor donde se construirá la tabla
     */
    #buildForm = (id_container, name, multiple) => {
        const form_container = id(id_container);
        const form = this.#object.FORM === undefined ? null : this.#object.FORM;
        if(form === null)
        {
            for(let property in this.#form)
            {
                let div_row = document.createElement("DIV");
                div_row.classList.add("row","justify-content-center");
                let div_col = document.createElement("DIV");
                div_col.classList.add("col-12");
                let names = this.#names(property, name, multiple);
                let element = this.#suitableItem(this.#form[property], names);
                if(!!element)
                    div_col.appendChild(element)
                div_row.appendChild(div_col);
                form_container.appendChild(div_row);
            }
        }
        else
        {
            for(let row of form)
            {
                let div_row = document.createElement("DIV");
                div_row.classList.add("row","justify-content-center");
                for(let property in row)
                {
                    if(this.#form[property] === undefined)
                    {
                        console.error(`Property "${property}" not found`);
                        break;
                    }
                    let div_col = document.createElement("DIV");
                    if(!!row[property])
                        div_col.classList.add(...row[property].split(" "));
                    let names = this.#names(property, name, multiple);
                    let element = this.#suitableItem(this.#form[property], names);
                    if(!!element)
                        div_col.appendChild(element)
                    div_row.appendChild(div_col);
                }
                form_container.appendChild(div_row);
            }
        }
    };
    form = (id_container = "form-container", name = null, multiple = false) => {
        this.#ids.form = `form-container-${this.#entity}`;
        this.#buildForm(id_container, name, multiple);
    };
    /**
     * @property property Nombre usado en el ENTITY como parámetro de la entidad
     * @property name @type string Nombre que se le puede adicionar al elemento para que el formulario sea único
     * @property multiple @type boolean TRUE: agrega campo múltiple
     * @returns array
     */
    #names = (property, name, multiple) => {
        let names = {name:null, id:null};
        names.name = `${this.#entity}_${property}`;
        names.id = `${this.#entity}_${property}`;
        if(name !== null)
        {
            names.name += `_${name}`;
            names.id += `_${name}`;
        }
        if(multiple)
        {
            if(window[`${this.#entity}_${property}`] === undefined)
                window[`${this.#entity}_${property}`] = 0;
            window[`${this.#entity}_${property}`] ++;
            names.name += `[]`;
            names.id += `_${window[`${this.#entity}_${property}`]}`;
        }
        return names;
    };
    /**
     * @property element (json) Elemento de la entidad
     * @property form (json) Elemento necesarios para el FORM
     * @property names (json) Conjunto de nombres
     * @returns object tipo form
    */
    #suitableItem = (element, names) => {
        if(element.VISIBILITY == 'TP_VISIBLE' || element.VISIBILITY == 'TP_VISIBLE_FORM' )
        {
            switch(element.TYPE)
            {
                case "TP_STRING":
                    return this.#input(element, names, "text");
                case "TP_LINK":
                    return this.#input(element, names, "url");
                case "TP_PHONE":
                    return this.#input(element, names, "phone");
                case "TP_EMAIL":
                    return this.#input(element, names, "email");
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
    #input = (element, names, type) => {
        let object = document.createElement("INPUT");
        let container = document.createElement("DIV");
        container.classList.add("form-group");
        object.setAttribute("type", type);
        if(element.CLASS === undefined)
            element.CLASS = "form-control";
        else
            element.CLASS += " form-control";
        switch ( type ) {
            case "number":
                object.setAttribute("type", "text");
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
        if(element.CLASS != null)
            object.classList.add(...element.CLASS.split(" "));
        if(element.REQUIRED)
            object.required = true;
        if(element.DISABLED)
            object.disabled = true;
        if(element.READONLY)
            object.readOnly = true;
        object.placeholder = element.PLACEHOLDER !== undefined ? element.PLACEHOLDER : element.NAME;
        object.setAttribute("aria-label", element.NAME);
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        if(element.LABEL)
        {
            let label = document.createElement("LABEL");
            label.htmlFor = names.id;
            label.textContent = element.NAME;
            container.appendChild(label);
        }
        container.appendChild(object);
        if(element.HELP !== undefined)
        {
            let small = document.createElement("SMALL");
            small.classList.add("form-text","text-muted");
            small.textContent = element.HELP;
            container.appendChild(small);
        }
        return container;
    };
    #inputDate = (element, names) => {
        let object = document.createElement("INPUT");
        let container = document.createElement("DIV");
        container.classList.add("form-group");
        if(element.CLASS === undefined)
            element.CLASS = "form-control text-right";
        else
            element.CLASS += " form-control text-right";
        if(element.CLASS != null)
            object.classList.add(...element.CLASS.split(" "));
        if(element.REQUIRED)
            object.required = true;
        if(element.DISABLED)
            object.disabled = true;
        if(element.READONLY)
            object.readOnly = true;
        object.setAttribute("type", "date");
        object.setAttribute("aria-label", element.NAME);
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        if(element.LABEL)
        {
            let label = document.createElement("LABEL");
            label.htmlFor = names.id;
            label.textContent = element.NAME;
            container.appendChild(label);
        }
        container.appendChild(object);
        if(element.HELP !== undefined)
        {
            let small = document.createElement("SMALL");
            small.classList.add("form-text","text-muted");
            small.textContent = element.HELP;
            q.appendChild(small);
        }
        return container;
    };
    #inputHidden = (element, names) => {
        let object = document.createElement("INPUT");
        object.setAttribute("type", "hidden");
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        return object;
    };
    #textarea = (element, names) => {
        let object = document.createElement("TEXTAREA");
        let container = document.createElement("DIV");
        container.classList.add("form-group");
        if(element.CLASS === undefined)
            element.CLASS = "form-control";
        else
            element.CLASS += " form-control";
        if(element.CLASS != null)
            object.classList.add(...element.CLASS.split(" "));
        if(element.REQUIRED)
            object.required = true;
        if(element.DISABLED)
            object.disabled = true;
        if(element.READONLY)
            object.readOnly = true;
        object.placeholder = element.PLACEHOLDER !== undefined ? element.PLACEHOLDER : element.NAME;
        object.setAttribute("aria-label", element.NAME);
        object.setAttribute("name", names.name);
        object.setAttribute("id", names.id);
        if(element.LABEL)
        {
            let label = document.createElement("LABEL");
            label.htmlFor = names.id;
            label.textContent = element.NAME;
            container.appendChild(label);
        }
        container.appendChild(object);
        if(element.HELP !== undefined)
        {
            let small = document.createElement("SMALL");
            small.classList.add("form-text","text-muted");
            small.textContent = element.HELP;
            container.appendChild(small);
        }
        return container;
    };
    #image = (element, names) => {
        let container = document.createElement("DIV");
        let images = container.cloneNode(true);
        let object = document.createElement("INPUT");
        let input = object.cloneNode(true);
        let label = document.createElement("LABEL");
        let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        let img = document.createElement("IMAGE");
        img.setAttribute("x","0");
        img.setAttribute("y","0");
        img.setAttribute("width","100%");
        img.setAttribute("xlink:href","");
        rect.setAttribute("fill", "#868e96");
        rect.setAttribute("height", "170");
        rect.classList.add("w-100");
        svg.setAttribute("aria-label", "Placeholder: Imagen");
        svg.setAttribute("height", "170");
        svg.classList.add("w-100");
        svg.appendChild(img);
        svg.appendChild(rect);

        images.classList.add("d-flex", "flex-column");
        container.classList.add("custom-file");
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
        container.appendChild(object);
        container.appendChild(label);
        container.appendChild(input);

        images.appendChild(svg);
        images.appendChild(container);
        return images;
    };
    #select = (element, names) => {

        return null;
    };
};