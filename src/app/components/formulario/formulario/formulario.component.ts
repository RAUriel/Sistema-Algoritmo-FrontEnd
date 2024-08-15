import { Component } from '@angular/core';
import { RespuestasService } from '../../../services/respuestas.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {

  respuestas: number[] = new Array(20).fill(null);

  constructor(private respuestasService: RespuestasService) { }

  preguntas = [
    {
      texto: '¿Cuál de los siguientes métodos prefieres para aprender algo nuevo?',
      opciones: [
        { valor: 0, texto: 'Ver videos o imágenes explicativas.' },
        { valor: 1, texto: 'Escuchar explicaciones o charlas.' },
        { valor: 2, texto: 'Realizar actividades prácticas o ejercicios.' }
      ]
    },
    {
      texto: 'Cuando estudias, ¿qué tipo de material te resulta más efectivo?',
      opciones: [
        { valor: 0, texto: 'Diagramas, gráficos y videos.' },
        { valor: 1, texto: 'Grabaciones de audio o podcasts.' },
        { valor: 2, texto: 'Manualidades o experimentos.' }
      ]
    },
    {
      texto: '¿Cómo te sientes más cómodo al recordar información?',
      opciones: [
        { valor: 0, texto: 'Recordando imágenes o gráficos.' },
        { valor: 1, texto: 'Recordando conversaciones o sonidos.' },
        { valor: 2, texto: 'Recordando movimientos o actividades que realizaste.' }
      ]
    },
    {
      texto: 'En una clase, ¿qué tipo de actividad te ayuda a entender mejor el contenido?',
      opciones: [
        { valor: 0, texto: 'Mirar presentaciones visuales o tomar notas con dibujos.' },
        { valor: 1, texto: 'Participar en discusiones o escuchar al profesor.' },
        { valor: 2, texto: 'Realizar proyectos o experimentos prácticos.' }
      ]
    },
    {
      texto: 'Si tienes que ensamblar un mueble, ¿cómo prefieres seguir las instrucciones?',
      opciones: [
        { valor: 0, texto: 'Mirando diagramas y fotos del manual.' },
        { valor: 1, texto: 'Escuchando instrucciones de alguien más.' },
        { valor: 2, texto: 'Siguiendo un paso a paso mientras lo armas tú mismo.' }
      ]
    },
    {
      texto: '¿Qué tipo de ejercicios prefieres en una clase de educación física?',
      opciones: [
        { valor: 0, texto: 'Observando demostraciones de movimientos.' },
        { valor: 1, texto: 'Escuchando las instrucciones del entrenador.' },
        { valor: 2, texto: 'Haciendo los ejercicios directamente.' }
      ]
    },
    {
      texto: '¿Cuál es tu método preferido para repasar antes de un examen?',
      opciones: [
        { valor: 0, texto: 'Haciendo esquemas y mapas conceptuales.' },
        { valor: 1, texto: 'Grabando tus notas y escuchándolas.' },
        { valor: 2, texto: 'Realizando ejercicios o prácticas del tema.' }
      ]
    },
    {
      texto: '¿Cómo prefieres aprender a usar un nuevo software o aplicación?',
      opciones: [
        { valor: 0, texto: 'Viendo tutoriales en video.' },
        { valor: 1, texto: 'Siguiendo una guía de audio o explicaciones verbales.' },
        { valor: 2, texto: 'Experimentando directamente con el software.' }
      ]
    },
    {
      texto: '¿Qué te resulta más fácil recordar después de una conferencia?',
      opciones: [
        { valor: 0, texto: 'Las diapositivas o imágenes que se mostraron.' },
        { valor: 1, texto: 'Lo que el ponente dijo.' },
        { valor: 2, texto: 'Las actividades o interacciones que tuviste.' }
      ]
    },
    {
      texto: '¿Cómo prefieres preparar una receta de cocina?',
      opciones: [
        { valor: 0, texto: 'Siguiendo fotos o videos del proceso.' },
        { valor: 1, texto: 'Escuchando un podcast o una grabación de las instrucciones.' },
        { valor: 2, texto: 'Haciendo la receta paso a paso mientras la lees.' }
      ]
    },
    // Nuevas preguntas agregadas:
    {
      texto: 'Acabo de terminar una competencia o una prueba y me gustaría recibir una opinión. Me gustaría recibirla:',
      opciones: [
        { valor: 0, texto: 'Mediante gráficos que muestren lo que alcancé.' },
        { valor: 1, texto: 'De alguien que lo hable conmigo.' },
        { valor: 2, texto: 'Utilizando ejemplos de lo que he hecho.' }
      ]
    },
    {
      texto: 'A la hora de elegir una carrera o un área de estudio, esto es importante para mí:',
      opciones: [
        { valor: 0, texto: 'Trabajar con diseños, mapas o gráficos.' },
        { valor: 1, texto: 'Comunicarme con otros a través del diálogo.' },
        { valor: 2, texto: 'Aplicar mis conocimientos en situaciones reales.' }
      ]
    },
    {
      texto: 'Prefiero un presentador o un profesor que utilice:',
      opciones: [
        { valor: 0, texto: 'Diagramas, cuadros, mapas o gráficos.' },
        { valor: 1, texto: 'Folletos, libros o lecturas.' },
        { valor: 2, texto: 'Demostraciones, modelos o sesiones prácticas.' }
      ]
    },
    {
      texto: 'Quiero aprender sobre un nuevo proyecto. Me gustaría pedir:',
      opciones: [
        { valor: 0, texto: 'Diagramas que muestren las etapas del proyecto con gráficos de beneficios y costes.' },
        { valor: 1, texto: 'Una oportunidad para hablar sobre el proyecto.' },
        { valor: 2, texto: 'Ejemplos en los que el proyecto se haya utilizado con éxito.' }
      ]
    },
    {
      texto: 'Cuando aprendo de Internet, me gusta:',
      opciones: [
        { valor: 0, texto: 'Los vídeos que muestran cómo hacer o fabricar algo.' },
        { valor: 1, texto: 'Los canales de audio donde puedo escuchar podcasts o entrevistas.' },
        { valor: 2, texto: 'Descripciones, listas y explicaciones escritas interesantes.' }
      ]
    },
    {
      texto: 'Tengo un problema en el corazón. Preferiría que el médico:',
      opciones: [
        { valor: 0, texto: 'Le mostrara un diagrama de lo que está mal.' },
        { valor: 1, texto: 'Le diera algo que leer para explicar lo que está mal.' },
        { valor: 2, texto: 'Utilizara un modelo de plástico para mostrar lo que está mal.' }
      ]
    },
    {
      texto: 'Quiero aprender a jugar un nuevo juego de mesa o de cartas. Yo:',
      opciones: [
        { valor: 0, texto: 'Utilizaría los diagramas que explican las distintas fases, movimientos y estrategias del juego.' },
        { valor: 1, texto: 'Leería las instrucciones.' },
        { valor: 2, texto: 'Observaría a otros jugar antes de unirme al juego.' }
      ]
    },
    {
      texto: 'Una página web tiene un vídeo que muestra cómo hacer un gráfico o una tabla especial. Hay una persona hablando, algunas listas y palabras que describen lo que hay que hacer y algunos diagramas. Aprendería más:',
      opciones: [
        { valor: 0, texto: 'Viendo los diagramas.' },
        { valor: 1, texto: 'Escuchando.' },
        { valor: 2, texto: 'Viendo las acciones.' }
      ]
    },
    {
      texto: 'Quiero ahorrar más dinero y decidir entre una serie de opciones. Yo:',
      opciones: [
        { valor: 0, texto: 'Usaría gráficos que muestren diferentes opciones para diferentes periodos de tiempo.' },
        { valor: 1, texto: 'Hablaría con un experto sobre las opciones.' },
        { valor: 2, texto: 'Consideraría ejemplos de cada opción utilizando mi información financiera.' }
      ]
    },
    {
      texto: 'Quiero aprender a hacer algo nuevo en una computadora. Yo:',
      opciones: [
        { valor: 0, texto: 'Seguiría los diagramas de un libro.' },
        { valor: 1, texto: 'Leería las instrucciones escritas que vienen con el programa.' },
        { valor: 2, texto: 'Empezaría a utilizarlo y aprender por ensayo y error.' }
      ]
    }
  ];

  enviarFormulario() {
    if (this.respuestas.includes(null)) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario incompleto',
        text: 'Por favor, responda todas las preguntas antes de enviar.'
      });
      return;
    }

    console.log(this.respuestas)
    // Estructura los datos para el archivo Excel
    const data = [this.respuestas];

    // Define las columnas del archivo Excel
    /*
    const columns = [
      'Pregunta 1', 'Pregunta 2', 'Pregunta 3', 'Pregunta 4', 'Pregunta 5',
      'Pregunta 6', 'Pregunta 7', 'Pregunta 8', 'Pregunta 9', 'Pregunta 10'
    ];*/


    const columns = [
      '¿Cuál de los siguientes métodos prefieres para aprender algo nuevo?', 'Cuando estudias, ¿qué tipo de material te resulta más efectivo?', '¿Cómo te sientes más cómodo al recordar información?', 'En una clase, ¿qué tipo de actividad te ayuda a entender mejor el contenido?', 'Si tienes que ensamblar un mueble, ¿cómo prefieres seguir las instrucciones?',
      '¿Qué tipo de ejercicios prefieres en una clase de educación física?', '¿Cuál es tu método preferido para repasar antes de un examen?', '¿Cómo prefieres aprender a usar un nuevo software o aplicación?', '¿Qué te resulta más fácil recordar después de una conferencia?', '¿Cómo prefieres preparar una receta de cocina?'
    ];

    // Convierte los datos a un formato adecuado para XLSX
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet([columns, ...data]);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Respuestas');

    // Genera y descarga el archivo Excel
    XLSX.writeFile(wb, 'respuestas.xlsx');

    Swal.fire({
      icon: 'success',
      title: 'Archivo generado',
      text: 'El archivo Excel ha sido generado exitosamente.'
    });

    this.respuestasService.guardarRespuestas(this.respuestas)
      .subscribe(response => {
        console.log(response);
        this.limpiarFormulario();
      }, error => {
        console.log(error);
        this.limpiarFormulario();
      });

  }

  limpiarFormulario() {
    this.respuestas.fill(null);
  }

}
