import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SimulationService, GridSnapshot } from '../../services/simulation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-grid-canvas',
  template: `
    <div class="canvas-container">
      <h3>Live Simulation</h3>
      <canvas #gridCanvas width="600" height="600"></canvas>
    </div>
  `,
  styles: [`
    .canvas-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 20px;
    }
    canvas {
      border: 2px solid #333;
      background-color: #f0f0f0; /* Grid background */
    }
  `]
})
export class GridCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gridCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private sub!: Subscription;

  // Configuration (Scale 20x20 grid to 600x600 pixels)
  private cellSize = 10; 

  constructor(private simService: SimulationService) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    
    // Subscribe to the stream
    this.sub = this.simService.getGridUpdates().subscribe(snapshot => {
      this.draw(snapshot);
    });
  }

  private draw(snapshot: GridSnapshot) {
    // 1. Clear the canvas
    const width = this.canvasRef.nativeElement.width;
    const height = this.canvasRef.nativeElement.height;
    this.ctx.clearRect(0, 0, width, height);

    snapshot.structures.forEach(struct => {
      const px = struct.x * this.cellSize;
      const py = struct.y * this.cellSize;

      if (struct.type === 'SOURCE') {
        this.ctx.fillStyle = '#FFD700'; // Gold Color
        this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
      } else if (struct.type === 'SINK') {
        this.ctx.fillStyle = '#00FF00'; // Green Color
        this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
      }
    });

    snapshot.pheromones.forEach(scent => {
      const px = scent.x * this.cellSize;
      const py = scent.y * this.cellSize;
        this.ctx.fillStyle = '#E0EE00';
        this.ctx.fillRect(px, py, this.cellSize, this.cellSize);
    })

    // 2. Dynamic resizing (if grid size changes in Java)
    // You might want to calculate cellSize based on snapshot.width vs canvas.width here.
    
    // 3. Draw Agents
    this.ctx.fillStyle = 'blue'; // Or use agent.color
    
    snapshot.agents.forEach(agent => {
      // Draw a circle or square for the agent
      const px = agent.x * this.cellSize;
      const py = agent.y * this.cellSize;
      
      this.ctx.beginPath();
      // Draw circle
      this.ctx.arc(px + this.cellSize/2, py + this.cellSize/2, this.cellSize/2 - 2, 0, 2 * Math.PI);
      this.ctx.fill();
    });
  }

  ngOnDestroy(): void {
    if (this.sub) this.sub.unsubscribe();
  }
}