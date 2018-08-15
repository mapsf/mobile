import {GeoPosition} from "~/shared/geo-position.model";

export interface MapOptions {
    accessToken: string;
    zoomLevel: number;
    style: string;
    location: GeoPosition;
}
