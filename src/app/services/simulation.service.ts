import { Injectable } from '@angular/core';
import { RxStomp } from '@stomp/rx-stomp';
import { map, Observable } from 'rxjs';

// Match the DTO structure from Java
export interface GridSnapshot {
  width: number;
  height: number;
  agents: AgentDTO[];
  structures: StructureDTO[];
  pheromones: PheromonesDTO[];  
  timestamp: number;
}
export interface StructureDTO {
  type: string;
  x: number;
  y: number;
}
export interface AgentDTO {
  id: string;
  x: number;
  y: number;
  color: string;
}
export interface PheromonesDTO {
  x: number;
  y: number;
  intensity: number;
  type: number;
}

@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  private rxStomp: RxStomp;

  constructor() {
    this.rxStomp = new RxStomp();
    this.rxStomp.configure({
      brokerURL: 'ws://localhost:8080/evoswarm-ws/websocket', // Ensure this matches your Spring Config
      connectHeaders: {},
      heartbeatIncoming: 0,
      heartbeatOutgoing: 20000,
      reconnectDelay: 200,
      debug: (msg: string) => {
        console.log(new Date(), msg);
      },
    });

    this.rxStomp.activate();
  }

  // Returns an Observable that emits every time the backend pushes a grid update
  getGridUpdates(): Observable<GridSnapshot> {
    return this.rxStomp.watch('/topic/grid').pipe(
      map((message) => JSON.parse(message.body) as GridSnapshot)
    );
  }

  disconnect() {
    this.rxStomp.deactivate();
  }
}