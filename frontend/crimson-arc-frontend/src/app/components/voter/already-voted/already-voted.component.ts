import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-already-voted',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, AvatarModule],
  templateUrl: './already-voted.component.html',
  styleUrls: ['./already-voted.component.css']
})
export class AlreadyVotedComponent implements OnInit {
  category: string = '';
  state?: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.category = params['category'] || '';
      this.state = params['state'];
    });
  }

  goBack() {
    this.router.navigate(['/voter/categories']);
  }
}

