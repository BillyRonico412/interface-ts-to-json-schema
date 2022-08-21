import {
    TypeObject,
    TypeNode,
    Compo,
    TypeBase,
    Key,
    Node,
} from "../logic/interface";

export const parentNode = new TypeObject(null, []);

let currentNode: Node | null = null;

/* 
Pour creer le langage intermédiaire, il suffit d'attacher une fonction
au POP. Lors de la lécture des terminaux.
*/

export const initNode = () => {
    parentNode.type = TypeNode.TypeObject;
    parentNode.parent = null;
    parentNode.value = "";
    parentNode.childrens = [];
    parentNode.isArrayNumber = 0;
    parentNode.isRequired = false;
    currentNode = null;
};

/* On souhaite donncer un type au noeud courant */
const pop_OpenBrace = () => {
    if (currentNode === null) {
        initNode();
        currentNode = parentNode;
    } else if (currentNode.type === TypeNode.Compo) {
        const newTypeObject = new TypeObject(currentNode, []);
        currentNode.childrens.push(newTypeObject);
        currentNode = newTypeObject;
    } else {
        throw new Error("Transform Tree Error");
    }
};

const pop_CloseBrace = () => {
    if (currentNode === null || currentNode.type !== TypeNode.TypeObject) {
        throw new Error("Transform Tree Error");
    } else {
        if (currentNode.parent === null) {
            console.log("End");
        } else {
            currentNode = currentNode.parent;
            if (currentNode.type !== TypeNode.Compo) {
                throw new Error("Transform Tree Error");
            }
        }
    }
};

const pop_TwoPoint = () => {
    if (currentNode === null || currentNode.type !== TypeNode.Key) {
        throw new Error("Transform Tree Error");
    } else {
        const newCompo = new Compo(currentNode as Key, []);
        currentNode.childrens.push(newCompo);
        currentNode = newCompo;
    }
};

const pop_InterogationTwoPoint = () => {
    if (currentNode === null || currentNode.type !== TypeNode.Key) {
        throw new Error("Transform Tree Error");
    } else {
        const newCompo = new Compo(currentNode as Key, []);
        currentNode.childrens.push(newCompo);
        currentNode.isRequired = false;
        currentNode = newCompo;
    }
};

const pop_Separator = () => {
    if (currentNode === null || currentNode.type !== TypeNode.Compo) {
        throw new Error("Transform Tree Error");
    } else {
        if (currentNode.parent && currentNode.parent.parent) {
            currentNode = currentNode.parent.parent;
            if (currentNode.type !== TypeNode.TypeObject) {
                throw new Error("Transform Tree Error");
            }
        } else {
            throw new Error("Transform Tree Error");
        }
    }
};

const pop_TypeBase = (valTypeBase: "number" | "string" | "boolean") => {
    if (currentNode === null || currentNode.type !== TypeNode.Compo) {
        throw new Error("Transform Tree Error");
    } else {
        const newTypeBase = new TypeBase(currentNode as Compo, valTypeBase);
        currentNode.childrens.push(newTypeBase);
    }
};

const pop_Key = (valKey: string) => {
    if (currentNode === null || currentNode.type !== TypeNode.TypeObject) {
        throw new Error("Transform Tree Error");
    } else {
        const newKey = new Key(currentNode as TypeObject, "", []);
        currentNode.childrens.push(newKey);
        currentNode = newKey;
        currentNode.value = valKey;
    }
};

const pop_Array = () => {
    if (currentNode === null || currentNode.type !== TypeNode.Compo) {
        throw new Error("Transform Tree Error");
    } else {
        const lastChildren =
            currentNode.childrens[currentNode.childrens.length - 1];
        lastChildren.isArrayNumber += 1;
    }
};

const pop_Pipe = () => {
    if (currentNode === null || currentNode.type !== TypeNode.Compo) {
        throw new Error("Transform Tree Error");
    }
};

const pop_OpenParenthesis = () => {
    if (currentNode === null || currentNode.type !== TypeNode.Compo) {
        throw new Error("Transform Tree Error");
    } else {
        const newCompo = new Compo(currentNode as Compo, []);
        currentNode.childrens.push(newCompo);
        currentNode = newCompo;
    }
};

const pop_CloseParenthesis = () => {
    if (currentNode === null || currentNode.type !== TypeNode.Compo) {
        throw new Error("Transform Tree Error");
    } else {
        if (currentNode.parent) {
            currentNode = currentNode.parent;
            if (currentNode.type !== TypeNode.Compo) {
                throw new Error("Transform Tree Error");
            }
        } else {
            throw new Error("Transform Tree Error");
        }
    }
};

export const pop = (term: string, value: string) => {
    switch (term) {
        case "OpenBrace":
            pop_OpenBrace();
            break;
        case "CloseBrace":
            pop_CloseBrace();
            break;
        case "TwoPoint":
            pop_TwoPoint();
            break;
        case "InterogationTwoPoint":
            pop_InterogationTwoPoint();
            break;
        case "Separator":
            pop_Separator();
            break;
        case "TypeBase":
            pop_TypeBase(value as "number" | "string" | "boolean");
            break;
        case "Key":
            pop_Key(value);
            break;
        case "Array":
            pop_Array();
            break;
        case "Pipe":
            pop_Pipe();
            break;
        case "OpenParenthesis":
            pop_OpenParenthesis();
            break;
        case "CloseParenthesis":
            pop_CloseParenthesis();
            break;
    }
};

const TypeObjectToJsonSchema = (node: Node) => {
    if (node.type !== TypeNode.TypeObject) {
        throw new Error("Transform JsonSchema Error");
    }
    const jsonSchema: any = {};
    jsonSchema.type = "object";
    jsonSchema.required = node.childrens
        .filter((child) => child.isRequired)
        .map((child) => child.value);
    jsonSchema.properties = {};
    node.childrens.forEach((child) => {
        jsonSchema.properties[child.value] = treeToJsonSchema(
            child.childrens[0]
        );
    });
    return jsonSchema;
};

const CompoToJsonSchema = (node: Node) => {
    if (node.type !== TypeNode.Compo) {
        throw new Error("Transform JsonSchema Error");
    }
    let jsonSchema: any = {};
    if (node.isArrayNumber) {
        jsonSchema.type = "array";
        node.isArrayNumber -= 1;
        jsonSchema.items = treeToJsonSchema(node);
    } else if (node.childrens.length === 1) {
        jsonSchema = treeToJsonSchema(node.childrens[0]);
    } else {
        jsonSchema.oneOf = node.childrens.map((child) =>
            treeToJsonSchema(child)
        );
    }
    return jsonSchema;
};

const TypeBaseToJsonSchema = (node: Node) => {
    if (node.type !== TypeNode.TypeBase) {
        throw new Error("Transform JsonSchema Error");
    }
    const jsonSchema: any = {};
    if (node.isArrayNumber) {
        jsonSchema.type = "array";
        node.isArrayNumber -= 1;
        jsonSchema.items = treeToJsonSchema(node);
    } else {
        jsonSchema.type = node.value;
    }
    return jsonSchema;
};

export const treeToJsonSchema = (node: Node) => {
    switch (node.type) {
        case TypeNode.TypeObject:
            return TypeObjectToJsonSchema(node);
        case TypeNode.Compo:
            return CompoToJsonSchema(node);
        case TypeNode.TypeBase:
            return TypeBaseToJsonSchema(node);
    }
};
