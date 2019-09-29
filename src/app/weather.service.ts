import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';

@Injectable()
export class WeatherService {
    constructor(public http:HttpClient) {
    }

    getCityInfo(city) {
        return this.http.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${city}&limit=10`, {
            headers :{
                "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
                "x-rapidapi-key": "812e859b39msh7c67822e6c288cap10efd5jsnb3d6c2175759"
            }
        }).pipe(
            map(response => {
                console.log(response['data']);
                return response['data'];
            })
        );
    }

    getWeather(code) {
        return this.http.get(`https://api.weatherbit.io/v2.0/current?city_id=${code}&key=04865dad1197411386f542183b1f4b44`)
        .pipe(
            map(response => {
                return response['data'] && response['data'][0] || {};
            })
        );
    }
}