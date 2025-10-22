# Modal Pattern - Quick Reference

## The Pattern You Requested ✅

```typescript
// Opening the modal
const instance = this.modalService.open(ComponentName, {
  size: 'lg',
  centered: true,
  backdrop: 'static'
});

// Passing data to modal
instance.componentInstance.propertyName = value;

// Subscribing to modal events
instance.componentInstance.reload.subscribe((val) => {
  if (val) {
    // Reload data
    this.loadData();
    // Dismiss modal
    instance.dismiss();
  }
});
```

## Actual Implementation

### Main Component (positions.component.ts)

```typescript
// For creating new position
openNewDialog() {
  const modalRef = this.modalService.open(PositionModalComponent, {
    size: 'lg',
    centered: true,
    backdrop: 'static'
  });

  modalRef.componentInstance.positionsCount = this.positions.length;
  
  modalRef.componentInstance.reload.subscribe((val: boolean) => {
    if (val) {
      this.loadPositions();
      modalRef.dismiss();
    }
  });
}

// For editing existing position
openEditDialog(position: Position) {
  const modalRef = this.modalService.open(PositionModalComponent, {
    size: 'lg',
    centered: true,
    backdrop: 'static'
  });

  modalRef.componentInstance.position = position;
  modalRef.componentInstance.positionsCount = this.positions.length;
  
  modalRef.componentInstance.reload.subscribe((val: boolean) => {
    if (val) {
      this.loadPositions();
      modalRef.dismiss();
    }
  });
}
```

### Modal Component (position-modal.component.ts)

```typescript
export class PositionModalComponent implements OnInit {
  // Input properties - receive data from parent
  @Input() position?: Position;
  @Input() positionsCount: number = 0;
  
  // Output event - notify parent
  @Output() reload = new EventEmitter<boolean>();

  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService,
    private messageService: MessageService
  ) {}

  savePosition() {
    // Perform save operation
    this.apiService.createPosition(payload).subscribe({
      next: () => {
        // Show success message
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Position created successfully'
        });
        
        // Emit reload event to parent
        this.reload.emit(true);
        
        // Close modal
        this.activeModal.close('saved');
      },
      error: (error) => {
        // Show error message
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to create position'
        });
      }
    });
  }
}
```

## Modal Options

```typescript
this.modalService.open(ComponentName, {
  size: 'sm' | 'md' | 'lg' | 'xl',        // Modal size
  centered: true,                          // Center vertically
  backdrop: 'static' | true | false,       // Backdrop behavior
  keyboard: true,                          // Close on ESC
  scrollable: true,                        // Scrollable content
  windowClass: 'custom-class',             // Custom CSS class
  backdropClass: 'custom-backdrop'         // Backdrop CSS class
});
```

## Complete Flow

```
1. User clicks button
   ↓
2. Parent opens modal: modalService.open(ComponentName, options)
   ↓
3. Parent passes data: modalRef.componentInstance.property = value
   ↓
4. Parent subscribes: modalRef.componentInstance.reload.subscribe(...)
   ↓
5. User interacts with modal form
   ↓
6. Modal performs API operation
   ↓
7. Modal emits event: this.reload.emit(true)
   ↓
8. Parent receives event in subscription
   ↓
9. Parent reloads data: this.loadData()
   ↓
10. Parent dismisses modal: modalRef.dismiss()
```

## Files Created

1. **position-modal.component.ts** - Standalone modal component
   - Contains all modal UI and logic
   - Receives data via @Input()
   - Emits events via @Output()

2. **positions.component.ts** - Updated parent component
   - Opens modal with modalService.open()
   - Passes data via componentInstance
   - Subscribes to reload event

## Usage for Other Entities

Copy this pattern for Contestants, Voters, Elections, etc:

```typescript
// 1. Create modal component: contestant-modal.component.ts
export class ContestantModalComponent {
  @Input() contestant?: Contestant;
  @Output() reload = new EventEmitter<boolean>();
  // ... implementation
}

// 2. Use in parent component
openNewContestant() {
  const modalRef = this.modalService.open(ContestantModalComponent, {
    size: 'lg',
    centered: true,
    backdrop: 'static'
  });
  
  modalRef.componentInstance.reload.subscribe((val) => {
    if (val) {
      this.loadContestants();
      modalRef.dismiss();
    }
  });
}
```

## Key Points

✅ Modal is a separate, standalone component  
✅ Data flows in via @Input() properties  
✅ Events flow out via @Output() emitters  
✅ Parent subscribes to events and reacts  
✅ Clean separation of concerns  
✅ Highly reusable pattern  
✅ Type-safe communication  

This is the exact pattern you requested and it's now implemented! 🎉

