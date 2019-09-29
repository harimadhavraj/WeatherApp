import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { WeatherService } from './../weather.service';
import { cityList as CityList } from './../cityList';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  searchInput:string = '';
  searchResults: any = [];
  selectedCity: any;
  modalRef: BsModalRef;
  loaded:boolean = false;
 
  constructor(private weatherService: WeatherService, private modalService: BsModalService) { }

  ngOnInit() {
  }

  onSubmit(searchForm: NgForm) {
    console.log(searchForm);
    if(searchForm.valid) {
      this.weatherService.getCityInfo(this.searchInput)
      .subscribe(data => {
        this.loaded = true;
        this.searchResults = data;
      });
    }
  }

  showCityWeather(cityInfo, template: TemplateRef<any>) {
    let city = CityList.find(city => city['city_name'].toLowerCase() == cityInfo.city.toLowerCase());
    console.log(city);
    if(city && city.id) {
      this.weatherService.getWeather(city.id).subscribe( data => {
        cityInfo.weather = data;
        this.selectedCity = cityInfo;
        this.modalRef = this.modalService.show(template);
      });
    } else {
      this.selectedCity = cityInfo;
      this.selectedCity.errorInfo = "The Weather information for the selected city is not available";
      this.modalRef = this.modalService.show(template);
    }

  }
}
