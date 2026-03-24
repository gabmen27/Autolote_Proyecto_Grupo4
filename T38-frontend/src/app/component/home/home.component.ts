import { Component, OnInit } from '@angular/core';
import { ExchangeRateService } from '../../services/exchange-rate.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  tasas: any = {};

  constructor(private exchangeRateService: ExchangeRateService) {}

  ngOnInit(): void {
    this.exchangeRateService.getExchangeRates().subscribe(
      (data) => {
        console.log('Respuesta de la API:', data);
        if (data.error) {
          this.tasas = { error: data.error };
          return;
        }

        // Soportar respuesta con top-level o con conversion_rates
        if (data.conversion_rates) {
          this.tasas = {
            USD: data.conversion_rates.USD || 1,
            HNL: data.conversion_rates.HNL,
            EUR: data.conversion_rates.EUR,
            GTQ: data.conversion_rates.GTQ
          };
          return;
        }

        this.tasas = {
          USD: data.USD || 1,
          HNL: data.HNL,
          EUR: data.EUR,
          GTQ: data.GTQ
        };
      },
      (error) => {
        console.log('Error en la API:', error);
        this.tasas = { error: 'Cargando tasas de cambio...' };
      }
    );
  }
}
