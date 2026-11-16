
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TicketService, Ticket, ApiResponse } from '../services/ticket';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class Tickets implements OnInit {
  constructor(
    private ticketService: TicketService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder
  ) {}

  tickets: Ticket[] = [];
  selectedTicket: Ticket | null = null;

  isLoading = false;
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  // UI state flags
  formVisible = false;
  isEditMode = false;
  editingTicketId: number | null = null;
  ticketForm!: FormGroup;

  // Initialize the reactive form
  initForm(): void {
    this.ticketForm = this.fb.group({
      subject: ['', [Validators.required, Validators.minLength(5)]],
      description: ['', [Validators.required, Validators.minLength(20)]],
      category_id: [null, Validators.required],
      priority: ['Medium', Validators.required]
    });
  }

  // Open Create Ticket form
  openCreateForm(): void {
    this.isEditMode = false;
    this.editingTicketId = null;
    this.initForm();
    this.formVisible = true;
  }

  // Open Edit Ticket form with existing data
  openEditForm(ticket: Ticket): void {
    this.isEditMode = true;
    this.editingTicketId = ticket.id;
    this.ticketForm = this.fb.group({
      subject: [ticket.subject, [Validators.required, Validators.minLength(5)]],
      description: [ticket.description, [Validators.required, Validators.minLength(20)]],
      category_id: [ticket.category_id, Validators.required],
      priority: [ticket.priority, Validators.required]
    });
    this.formVisible = true;
  }

  // Submit form for create or update
  submitForm(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }
    const payload = this.ticketForm.value;
    if (this.isEditMode && this.editingTicketId !== null) {
      this.ticketService.updateTicket(this.editingTicketId, payload).subscribe({
        next: () => {
          this.loadTickets();
          this.formVisible = false;
        },
        error: (err) => {
          console.error('Update error:', err);
          this.errorMessage = err.error?.message || 'Failed to update ticket.';
        }
      });
    } else {
      this.ticketService.createTicket(payload).subscribe({
        next: () => {
          this.loadTickets();
          this.formVisible = false;
        },
        error: (err) => {
          console.error('Create error:', err);
          this.errorMessage = err.error?.message || 'Failed to create ticket.';
        }
      });
    }
  }

  // Delete ticket with confirmation
  deleteTicket(id: number): void {
    if (!window.confirm('Are you sure you want to delete this ticket?')) {
      return;
    }
    this.ticketService.deleteTicket(id).subscribe({
      next: () => this.loadTickets(),
      error: (err) => {
        console.error('Delete error:', err);
        this.errorMessage = err.error?.message || 'Failed to delete ticket.';
      }
    });
  }


  ngOnInit(): void {
    this.loadTickets();
  }

  // Fetch all tickets
  loadTickets(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.ticketService.getTickets().subscribe({

      next: (response: ApiResponse<Ticket[]>) => {

        console.log('Full API Response:', response);

        this.tickets = response.data || [];

        console.log('Tickets Loaded:', this.tickets);
        console.log('Total Tickets:', this.tickets.length);

        this.isLoading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {

        console.error('API Error:', error);

        this.errorMessage = 'Unable to load tickets.';
        this.isLoading = false;

        this.cdr.detectChanges();
      }

    });

  }

  // Fetch one ticket with robust handling
  viewTicket(id: number): void {
    console.log('Opening ticket:', id);
    // Reset any existing selection before loading new one
    this.selectedTicket = null;
    this.cdr.detectChanges();
    this.ticketService.getTicket(id).subscribe({
      next: (response: ApiResponse<Ticket>) => {
        console.log('Ticket Details Response:', response);
        // Support both direct ticket data and nested { ticket: ... } structures
        const ticketData = (response.data && (response.data as any).ticket) ? (response.data as any).ticket : response.data;
        this.selectedTicket = ticketData as Ticket;
        console.log('Selected Ticket:', this.selectedTicket);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('View Ticket API Error:', error);
        // Show a user‑friendly error message
        this.errorMessage = 'Failed to load ticket details.';
        this.cdr.detectChanges();
      }
    });
  }

  // Close ticket details
  closeTicket(): void {

    this.selectedTicket = null;

    this.cdr.detectChanges();

  }

}
