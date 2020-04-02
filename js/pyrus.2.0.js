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
     * @description Construye ARRAY de elementos de la cabecera de la tabla
     */
    #getColumn = () => {
        let width_ = "auto";
        let class_ = "";
        let name_ = "";
        this.#column = [];
        if(__ENTITY[this.#entity].COLUMN === undefined)
        {
            for(let property in this.#specification)
            {
                if(this.#specification[property].TYPE == "TP_PK")
                    continue;
                if(this.#specification[property].VISIBILITY != "TP_VISIBLE" && this.#specification[property].VISIBILITY != "TP_VISIBLE_TABLE" )
                    continue;
                width_ = "auto";
                class_ = "";
                name_ = property.toUpperCase();
                if(this.#specification[property].NAME !== undefined)
                    name_ = this.#specification[property].NAME.toUpperCase();
                if(this.#specification[property].WIDTH !== undefined && this.#specification[property].TABLE === undefined)
                    width_ = this.#specification[property].WIDTH;
                else {
                    if(this.#specification[property].TABLE !== undefined)
                        width_ = this.#specification[property].TABLE;
                }
                if(this.#specification[property].CLASS !== undefined)
                    class_ = this.#specification[property].CLASS
                this.#column.push({ NAME: name_, COLUMN: property, WIDTH: width_, CLASS: class_});
            }
        }
        else
        {
            for(let property in __ENTITY[this.#entity].COLUMN)
            {
                if(this.#specification[property] === undefined)
                    continue;
                if(this.#specification[property].TYPE == "TP_PK")
                    continue;
                if(this.#specification[property].VISIBILITY != "TP_VISIBLE" && this.#specification[property].VISIBILITY != "TP_VISIBLE_TABLE" )
                    continue;
                width_ = __ENTITY[this.#entity].COLUMN[property].WIDTH === undefined ? "auto" : __ENTITY[this.#entity].COLUMN[property].WIDTH;
                class_ = "";
                name_ = property.toUpperCase();
                if(this.#specification[property].NAME !== undefined)
                    name_ = this.#specification[property].NAME.toUpperCase();
                if(this.#specification[property].CLASS !== undefined)
                    class_ = this.#specification[property].CLASS
                this.#column.push({ NAME: name_, COLUMN: property, WIDTH: width_, CLASS: class_});
            }
        }
    };
    /**
     * @property id_container (string) ID del contenedor donde se construirá la tabla
     */
    table = (id_container = "table-container") => {
        const table_container = id(id_container);

        let element = document.createElement("TABLE");
        element.setAttribute("id", `table-container-${this.#entity}`);
        let element_head = element.createTHead();
        let element_head_tr = document.createElement("TR");
        let element_body = document.createElement("TBODY");
        element.classList.add("table");
        element_head.classList.add("thead-dark");
        element_head.appendChild(element_head_tr);
        element.appendChild(element_head);
        table_container.appendChild(element);

        for(let column of this.#column)
        {
            let th = document.createElement("TH");
            th.textContent = column.NAME;
            element_head_tr.appendChild(th);
        }
    };
};