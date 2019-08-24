import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  baseUrl = "http://localhost:5000/api/";
  callServiceGet(url, success, error) {
    this.httpClient.get(this.baseUrl + url).subscribe((res) => {
      success(res)
    }, (err) => {
      error(err);
    });
  }
  callServicePost(url: string, data: any, success, error) {
    this.httpClient.post(this.baseUrl + url, data).subscribe((res) => {
      success(res)
    }, (err) => {
      error(err);
    });
  }
}
