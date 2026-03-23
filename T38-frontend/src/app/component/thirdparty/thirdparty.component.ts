import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThirdpartyService } from '../../services/thirdparty.service';

@Component({
  selector: 'app-thirdparty',
  imports: [CommonModule],
  templateUrl: './thirdparty.component.html',
  styleUrl: './thirdparty.component.scss'
})
export class ThirdpartyComponent implements OnInit {
  products: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(private thirdpartyService: ThirdpartyService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.errorMessage = '';

    this.thirdpartyService.getProducts().subscribe({
      next: (response) => {
        this.products = response.data || [];
        this.loading = false;
      },
      error: (err) => {
        this.errorMessage = err?.error?.message || 'No se pudo obtener productos de terceros';
        this.loading = false;
      }
    });
  }
}
