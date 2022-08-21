export enum TypeNode {
    TypeObject,
    Key,
    Compo,
    TypeBase,
}

export interface Node {
    parent: Node | null;
    type: TypeNode;
    value: string;
    childrens: Node[];
    isArrayNumber: number;
    isRequired: boolean;
}

export class TypeObject implements Node {
    type: TypeNode.TypeObject;
    value: string;
    childrens: Key[];
    isArrayNumber: number;
    parent: Node | null;
    isRequired: boolean;
    constructor(parent: Node | null, childrens: Key[]) {
        this.type = TypeNode.TypeObject;
        this.parent = parent;
        this.value = "";
        this.childrens = childrens;
        this.isArrayNumber = 0;
        this.isRequired = true;
    }
}

export class Key implements Node {
    parent: TypeObject;
    type: TypeNode.Key;
    value: string;
    childrens: Compo[];
    isArrayNumber: number;
    isRequired: boolean;
    constructor(parent: TypeObject, value: string, childrens: Compo[]) {
        this.type = TypeNode.Key;
        this.parent = parent;
        this.value = value;
        this.childrens = childrens;
        this.isArrayNumber = 0;
        this.isRequired = true;
    }
}

export class Compo implements Node {
    parent: Key | Compo;
    type: TypeNode.Compo;
    value: string;
    childrens: (Compo | TypeObject | TypeBase)[];
    isArrayNumber: number;
    isRequired: boolean;
    constructor(
        parent: Key | Compo,
        childrens: (Compo | TypeObject | TypeBase)[]
    ) {
        this.type = TypeNode.Compo;
        this.parent = parent;
        this.value = "";
        this.childrens = childrens;
        this.isArrayNumber = 0;
        this.isRequired = true;
    }
}

export class TypeBase implements Node {
    parent: Compo;
    type: TypeNode.TypeBase;
    value: "number" | "string" | "boolean";
    childrens: [];
    isArrayNumber: number;
    isRequired: boolean;

    constructor(parent: Compo, value: "number" | "string" | "boolean") {
        this.type = TypeNode.TypeBase;
        this.parent = parent;
        this.value = value;
        this.childrens = [];
        this.isArrayNumber = 0;
        this.isRequired = true;
    }
}