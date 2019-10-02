import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Component, OnInit, TemplateRef } from '@angular/core';
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
  public locationSubject: Subject<string> = new Subject<string>();
  showblocker: boolean = false;
  inputPattern: RegExp = new RegExp('^[a-zA-Z]*$');
 
  constructor(private weatherService: WeatherService, private modalService: BsModalService) { }

  ngOnInit() {
    this.locationSubject
      .pipe(
        debounceTime(500),
        distinctUntilChanged() ).subscribe(searchTextValue => {
        this.showblocker = true
        this.searchLocation(searchTextValue);
      })
  }

  searchLocation(locationName: string) {
    this.weatherService.getCityInfo(locationName)
    .subscribe(data => {
      this.loaded = true;
      this.showblocker = false;
      data.forEach(cityInfo => {
        let city = CityList.find(city => city['city_name'].toLowerCase() == cityInfo.city.toLowerCase());
        cityInfo.hasInfo = city ? true : false;
      });
      this.searchResults = data;
    });
  }

  onValueChange() {
    this.showblocker = false;
    if(this.searchInput.length >= 2 && (this.inputPattern).test(this.searchInput)) {
      this.locationSubject.next(this.searchInput);
    }
  }

  showCityWeather(cityInfo, template: TemplateRef<any>) {
    let city = CityList.find(city => city['city_name'].toLowerCase() == cityInfo.city.toLowerCase());
    this.showblocker = true;
    console.log(city);
    if(city && city.id) {
      this.weatherService.getWeather(city.id).subscribe( data => {
        cityInfo.weather = data;
        this.showblocker = false;
        this.selectedCity = cityInfo;
        this.modalRef = this.modalService.show(template);
      });
    } else {
      this.selectedCity = cityInfo;
      this.showblocker = false;
      this.selectedCity.errorInfo = "The Weather information for the selected city is not available";
      this.modalRef = this.modalService.show(template);
    }
  }

  resetForm() {
    this.selectedCity = null;
    this.loaded = false;
    this.searchResults = [];
  }
}
