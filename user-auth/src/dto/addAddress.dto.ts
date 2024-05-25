export class AddressDto {
    readonly label: string;
    readonly street: string;
    readonly city: string;
    readonly state: string;
    readonly zip: string;

    constructor(label: string, street: string, city: string, state: string, zip: string) {
        this.label = label;
        this.street = street;
        this.city = city;
        this.state = state;
        this.zip = zip;
    }

    toString() {
        return JSON.stringify({
            label: this.label,
            street: this.street,
            city: this.city,
            state: this.state,
            zip: this.zip
        });
    }
}
