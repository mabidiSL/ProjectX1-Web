import { Component, OnInit } from '@angular/core';
import { LoaderService } from "../../../core/services/loader.service";

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  loading: boolean = true;

  constructor(private loaderService: LoaderService) {

    this.loaderService.isLoading.subscribe((v) => {
      this.loading = v;

    // If loading is true, show the spinner and then reload after a brief delay
    if (this.loading) {
      // Delay for a brief moment to allow spinner to appear
      setTimeout(() => {
        window.location.reload(); // Reload the page
      }, 500); // 500ms delay is enough for the spinner to show
    }
  });
  }
  ngOnInit(): void {
  }

}
