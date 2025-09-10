export default class TitleModel<T> {
    constructor(
        public id: number,
        public title: string,
        public subtitle?: string,
        public type?: T
    ) {
        this.id = id;
        this.title = title;
        this.subtitle = subtitle || "";
        this.type = type;
    }

    static fromMap<T>(map: { [key: string]: unknown }): TitleModel<T> {
        return new TitleModel<T>(
            map.id as number,
            map.title as string,
            map.subtitle as string,
            map.type as T
        );
    }
}