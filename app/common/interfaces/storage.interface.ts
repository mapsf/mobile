export interface StorageInterface {
    get(key: string, defaultValue: any): any;

    set(key: string, value: any): void;

    remove(key: string): void;

    removeAll(): void;
}
