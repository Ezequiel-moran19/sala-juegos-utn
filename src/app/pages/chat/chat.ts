import { Component, inject, OnInit, NgZone, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '../../services/supabase/supabase.client';
import { MensajeChat } from '../../interfaces/chat/mensaje-chat';
import { AuthService } from '../../services/auth/auth.service';
import { ChatService } from '../../services/chat/chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {

  chatService = inject(ChatService);
  authService = inject(AuthService);
  ngZone = inject(NgZone);
  cdr = inject(ChangeDetectorRef);
  fb = inject(FormBuilder);

  mensajes: MensajeChat[] = [];
  canalChat?: RealtimeChannel;

  @ViewChild('chatBox') chatBox!: ElementRef;

  formMensaje: FormGroup = this.fb.group({
    mensaje: ['', Validators.required]
  });

  readonly canal = 'chat-global';

  usuarioActual = this.authService.usuarioActual()?.email;

  async ngOnInit() {
    await this.cargarMensajes();
    this.suscribirseChat();
  }

  private scrollToBottom() {
    try {
      const el = this.chatBox.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {}
  }

  private autoScroll() {
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);
  }

  async cargarMensajes() {

    const { data, error } = await this.chatService.obtenerMensajes();

    if (error) {
      console.error(error);
      return;
    }

    this.mensajes = data ?? [];
    this.cdr.detectChanges();

    this.autoScroll();
  }

  async enviarMensaje() {

    if (this.formMensaje.invalid) return;

    const texto = this.formMensaje.value.mensaje;

    const mensaje = this.chatService.crearMensaje(
      this.authService.usuarioActual()?.email ?? '',
      texto
    );

    const { error } = await this.chatService.enviarMensaje(mensaje);

    if (error) {
      console.error(error);
      return;
    }

    this.formMensaje.reset();
    this.autoScroll();
  }

  suscribirseChat() {

    if (this.canalChat) return;

    this.canalChat = supabase
      .channel(this.canal)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mensajes_chat'
        },
        (payload) => {

          this.ngZone.run(() => {

            const nuevo = payload.new as MensajeChat;

            this.mensajes = [...this.mensajes, nuevo];

            this.cdr.detectChanges();

            this.autoScroll();
          });
        }
      )
      .subscribe();
  }

  esMensajePropio(mensaje: MensajeChat): boolean {
    return mensaje.usuario === this.usuarioActual;
  }
}