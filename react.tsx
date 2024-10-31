import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, User, LogOut, Printer } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { DatePickerWithRange } from "@/components/ui/date-picker-with-range"

type Usuario = {
  id: string;
  nombre: string;
  rol: 'estudiante' | 'profesor' | 'administrador' | 'superadmin';
  grado?: number;
  grupo?: string;
}

type Nota = {
  valor: number | null;
}

type ComponenteCalificacion = {
  notas: [Nota, Nota, Nota];
}

type Calificacion = {
  estudiante: string;
  asignatura: string;
  cognitivo: ComponenteCalificacion;
  personal: ComponenteCalificacion;
  social: ComponenteCalificacion;
}

type Asignatura = {
  nombre: string;
  area: string;
  grados: number[];
  horasSemanales: number;
}

type Profesor = {
  id: string;
  nombre: string;
  area: string;
  asignaturas: string[];
}

type HorarioClase = {
  dia: string;
  hora: string;
  asignatura: string;
  profesor: string;
  grado: number;
  grupo: string;
}

type Desempeno = {
  estudiante: string;
  area: string;
  asignatura: string;
  intensidadHoraria: number;
  notaSemestre1: number;
  notaSemestre2: number;
  valoracionFinal: number;
  valoracionLetras: string;
  valoracionRequerida: number;
}

type DesempenoAsignatura = {
  estudiante: string;
  notaCognitiva: number;
  notaPersonal: number;
  notaSocial: number;
  valoracionSemestre: number;
  valoracionFinal: number;
  valoracionLetras: string;
  valoracionRequerida: number;
}

type DesempenoGrado = {
  grado: number;
  estudiantesTotales: number;
  areasTotales: number;
  asignaturasTotales: number;
  areasPerdidas: number;
  areasGanadas: number;
  promedioAsignaturasPerdidas: number;
  promedioAsignaturasGanadas: number;
}

type DesempenoGrupo = {
  grado: number;
  grupo: string;
  estudiantesTotales: number;
  areasTotales: number;
  asignaturasTotales: number;
  areasPerdidas: number;
  areasGanadas: number;
  promedioAsignaturasPerdidas: number;
  promedioAsignaturasGanadas: number;
}

type PromediosPuestos = {
  estudiante: string;
  areasDesempenoSuperior: number;
  areasDesempenoAlto: number;
  areasDesempenoBasico: number;
  areasDesempenoBajo: number;
  promedioGeneralCalculado: number;
  promedioGeneralGuardado: number;
}

type EventoInstitucional = {
  nombre: string;
  fechaInicio: Date;
  fechaFin: Date;
  tipo: 'Clase' | 'Vacaciones' | 'Evento' | 'Calificaciones';
}

const calcularPromedioComponente = (componente: ComponenteCalificacion): number => {
  const notasValidas = componente.notas.filter(nota => nota.valor !== null);
  const suma = notasValidas.reduce((acc, nota) => acc + (nota.valor || 0), 0);
  
  if (notasValidas.length === 0) return 0;
  if (notasValidas.length === 1) return suma;
  if (notasValidas.length === 2) {
    const promedio = suma / 2;
    return suma + promedio;
  }
  return suma;
}

const asignaturas: Asignatura[] = [
  // Humanidades y Lenguaje
  { nombre: "Literatura", area: "Humanidades y Lenguaje", grados: [6, 7, 8, 9, 10, 11], horasSemanales: 3 },
  { nombre: "Inglés y Lengua Extranjera", area: "Humanidades y Lenguaje", grados: [6, 7, 8, 9, 10, 11], horasSemanales: 3 },
  { nombre: "Lectura Crítica", area: "Humanidades y Lenguaje", grados: [6, 7, 8, 10], horasSemanales: 1 },
  { nombre: "Teatro", area: "Humanidades y Lenguaje", grados: [6], horasSemanales: 3 },
  { nombre: "Música", area: "Humanidades y Lenguaje", grados: [7], horasSemanales: 3 },
  { nombre: "Danza", area: "Humanidades y Lenguaje", grados: [8], horasSemanales: 3 },
  { nombre: "Artes Audiovisuales", area: "Humanidades y Lenguaje", grados: [9, 10, 11], horasSemanales: 2 },
  
  // Matemáticas
  { nombre: "Ciencias y Estadística", area: "Matemáticas", grados: [6, 7, 8, 9], horasSemanales: 2 },
  { nombre: "Ciencias y Estadística", area: "Matemáticas", grados: [10, 11], horasSemanales: 1 },
  { nombre: "Geometría", area: "Matemáticas", grados: [6, 7, 8, 9], horasSemanales: 1 },
  { nombre: "Aritmética", area: "Matemáticas", grados: [6, 7], horasSemanales: 3 },
  { nombre: "Álgebra", area: "Matemáticas", grados: [8, 9], horasSemanales: 3 },
  { nombre: "Trigonometría", area: "Matemáticas", grados: [10], horasSemanales: 4 },
  { nombre: "Pre-cálculo y Análisis Matemático", area: "Matemáticas", grados: [11], horasSemanales: 4 },
  
  // Ciencias Sociales
  { nombre: "Historia", area: "Ciencias Sociales", grados: [6, 7, 8, 9], horasSemanales: 2 },
  { nombre: "Geografía", area: "Ciencias Sociales", grados: [6, 7, 8, 9], horasSemanales: 2 },
  { nombre: "Pensamiento Ciudadano", area: "Ciencias Sociales", grados: [6, 7, 8, 9], horasSemanales: 2 },
  { nombre: "Filosofía", area: "Ciencias Sociales", grados: [10, 11], horasSemanales: 2 },
  { nombre: "Economía y Política", area: "Ciencias Sociales", grados: [10, 11], horasSemanales: 1 },
  { nombre: "Geografía Política", area: "Ciencias Sociales", grados: [10, 11], horasSemanales: 1 },
  { nombre: "Cátedra Afrocolombiana", area: "Ciencias Sociales", grados: [6, 10, 11], horasSemanales: 1 },
  
  // Ciencias Naturales
  { nombre: "Biología", area: "Ciencias Naturales", grados: [6, 7, 8, 9], horasSemanales: 3 },
  { nombre: "Biología", area: "Ciencias Naturales", grados: [10, 11], horasSemanales: 1 },
  { nombre: "Física", area: "Ciencias Naturales", grados: [9], horasSemanales: 1 },
  { nombre: "Física", area: "Ciencias Naturales", grados: [10, 11], horasSemanales: 3 },
  { nombre: "Química", area: "Ciencias Naturales", grados: [9], horasSemanales: 1 },
  { nombre: "Química", area: "Ciencias Naturales", grados: [10, 11], horasSemanales: 3 },
  { nombre: "Laboratorio", area: "Ciencias Naturales", grados: [6, 7, 8], horasSemanales: 1 },
  
  // Ciencias de la Computación y Tecnología
  { nombre: "Tecnología", area: "Ciencias de la Computación y Tecnología", grados: [6, 7, 8, 9], horasSemanales: 3 },
  { nombre: "Tecnología", area: "Ciencias de la Computación y Tecnología", grados: [10, 11], horasSemanales: 2 },
  { nombre: "Nociones de Programación", area: "Ciencias de la Computación y Tecnología", grados: [6, 7, 8, 9, 10, 11], horasSemanales: 2 },
  
  // Recreación y Educación en Deportes
  { nombre: "Educación Física y Deporte", area: "Recreación y Educación en Deportes", grados: [6, 7, 8, 9], horasSemanales: 3 },
  { nombre: "Educación Física y Deporte", area: "Recreación y Educación en Deportes", grados: [10, 11], horasSemanales: 2 },
  
  // Orientación Vocacional y Religiosa
  { nombre: "Religión", area: "Orientación Vocacional y Religiosa", grados: [6, 7, 8, 9, 10, 11], horasSemanales: 1 },
  { nombre: "Ética y Valores Humanos", area: "Orientación Vocacional y Religiosa", grados: [6, 7, 8, 9], horasSemanales: 1 },
  { nombre: "Psicorientación y Vocación", area: "Orientación Vocacional y Religiosa", grados: [10, 11], horasSemanales: 1 },
  { nombre: "Orientación Sexual", area: "Orientación Vocacional y Religiosa", grados: [6, 7, 8], horasSemanales: 1 },
  
  // Educación Financiera y Comercial
  { nombre: "Contabilidad Básica", area: "Educación Financiera y Comercial", grados: [10, 11], horasSemanales: 2 },
  { nombre: "Finanzas", area: "Educación Financiera y Comercial", grados: [10, 11], horasSemanales: 2 },
  { nombre: "Secretaría y Comercio", area: "Educación Financiera y Comercial", grados: [10, 11], horasSemanales: 1 },
];

const profesores: Profesor[] = [
  // Humanidades y Lenguaje
  { id: "prof.1001", nombre: "María Rodríguez", area: "Humanidades y Lenguaje", asignaturas: ["Literatura", "Lectura Crítica"] },
  { id: "prof.1002", nombre: "John Smith", area: "Humanidades y Lenguaje", asignaturas: ["Inglés y Lengua Extranjera"] },
  { id: "prof.1003", nombre: "Ana García", area: "Humanidades y Lenguaje", asignaturas: ["Teatro", "Música", "Danza"] },
  { id: "prof.1004", nombre: "Carlos López", area: "Humanidades y Lenguaje", asignaturas: ["Artes Audiovisuales"] },

  // Matemáticas
  { id: "prof.2001", nombre: "Laura Martínez", area: "Matemáticas", asignaturas: ["Ciencias y Estadística", "Geometría"] },
  { id: "prof.2002", nombre: "Pedro Sánchez", area: "Matemáticas", asignaturas: ["Aritmética", "Álgebra"] },
  { id: "prof.2003", nombre: "Isabel Fernández", area: "Matemáticas", asignaturas: ["Trigonometría"] },
  { id: "prof.2004", nombre: "Roberto Gómez", area: "Matemáticas", asignaturas: ["Pre-cálculo y Análisis Matemático"] },

  // Ciencias Sociales
  { id: "prof.3001", nombre: "Carmen Díaz", area: "Ciencias Sociales", asignaturas: ["Historia", "Geografía"] },
  { id: "prof.3002", nombre: "Javier Ruiz", area: "Ciencias Sociales", asignaturas: ["Pensamiento Ciudadano", "Cátedra Afrocolombiana"] },
  { id: "prof.3003", nombre: "Elena Torres", area: "Ciencias Sociales", asignaturas: ["Filosofía", "Economía y Política"] },
  { id: "prof.3004", nombre: "Miguel Ángel Pérez", area: "Ciencias Sociales", asignaturas: ["Geografía Política"] },

  // Ciencias Naturales
  { id: "prof.4001", nombre: "Sofía Ramírez", area: "Ciencias Naturales", asignaturas: ["Biología", "Laboratorio"] },
  { id: "prof.4002", nombre: "Andrés Morales", area: "Ciencias Naturales", asignaturas: ["Física"] },
  { id: "prof.4003", nombre: "Lucía Herrera", area: "Ciencias Naturales", asignaturas: ["Química"] },
  { id: "prof.4004", nombre: "Daniel Castro", area: "Ciencias Naturales", asignaturas: ["Biología", "Laboratorio"] },

  // Ciencias de la Computación y Tecnología
  { id: "prof.5001", nombre: "Fernando Ortiz", area: "Ciencias de la Computación y Tecnología", asignaturas: ["Tecnología", "Nociones de Programación"] },
  { id: "prof.5002", nombre: "Patricia Vega", area: "Ciencias de la Computación y Tecnología", asignaturas: ["Tecnología", "Nociones de Programación"] },
  { id: "prof.5003", nombre: "Raúl Mendoza", area: "Ciencias de la Computación y Tecnología", asignaturas: ["Tecnología", "Nociones de Programación"] },
  { id: "prof.5004", nombre: "Gabriela Núñez", area: "Ciencias de la Computación y Tecnología", asignaturas: ["Tecnología", "Nociones de Programación"] },

  // Recreación y Educación en Deportes
  { id: "prof.6001", nombre: "Jorge Vargas", area: "Recreación y Educación en Deportes", asignaturas: ["Educación Física y Deporte"] },
  { id: "prof.6002", nombre: "Valeria Campos", area: "Recreación y Educación en Deportes", asignaturas: ["Educación Física y Deporte"] },
  { id: "prof.6003", nombre: "Héctor Rivas", area: "Recreación y Educación en Deportes", asignaturas: ["Educación Física y Deporte"] },
  { id: "prof.6004", nombre: "Natalia Paredes", area: "Recreación y Educación en Deportes", asignaturas: ["Educación Física y Deporte"] },

  // Orientación Vocacional y Religiosa
  { id: "prof.7001", nombre: "Ernesto Guzmán", area: "Orientación Vocacional y Religiosa", asignaturas: ["Religión", "Ética y Valores Humanos"] },
  { id: "prof.7002", nombre: "Beatriz Soto", area: "Orientación Vocacional y Religiosa", asignaturas: ["Psicorientación y Vocación",   "Orientación Sexual"] },
  { id: "prof.7003", nombre: "Ricardo Molina", area: "Orientación Vocacional y Religiosa", asignaturas: ["Religión", "Ética y Valores Humanos"] },
  { id: "prof.7004", nombre: "Silvia Rojas", area: "Orientación Vocacional y Religiosa", asignaturas: ["Psicorientación y Vocación", "Orientación Sexual"] },

  // Educación Financiera y Comercial
  { id: "prof.8001", nombre: "Alejandro Duarte", area: "Educación Financiera y Comercial", asignaturas: ["Contabilidad Básica", "Finanzas"] },
  { id: "prof.8002", nombre: "Mónica Estrada", area: "Educación Financiera y Comercial", asignaturas: ["Secretaría y Comercio", "Finanzas"] },
  { id: "prof.8003", nombre: "Gustavo Pinto", area: "Educación Financiera y Comercial", asignaturas: ["Contabilidad Básica", "Finanzas"] },
  { id: "prof.8004", nombre: "Carolina Medina", area: "Educación Financiera y Comercial", asignaturas: ["Secretaría y Comercio", "Finanzas"] },
];

const usuariosEjemplo: Usuario[] = [
  { id: "iide.1234567890", nombre: "Juan Pérez", rol: "estudiante", grado: 9, grupo: "A" },
  { id: "prof.9876543210", nombre: "María Rodríguez", rol: "profesor" },
  { id: "admin.1357924680", nombre: "Carlos Gómez", rol: "administrador" },
  { id: "super.2468013579", nombre: "Ana Martínez", rol: "superadmin" }
];

const calificacionesEjemplo: Calificacion[] = [
  {
    estudiante: "Juan Pérez",
    asignatura: "Literatura",
    cognitivo: { notas: [{ valor: 4.5 }, { valor: null }, { valor: 4.2 }] },
    personal: { notas: [{ valor: 4.0 }, { valor: 3.8 }, { valor: null }] },
    social: { notas: [{ valor: 4.2 }, { valor: null }, { valor: null }] }
  },
  {
    estudiante: "Juan Pérez",
    asignatura: "Matemáticas",
    cognitivo: { notas: [{ valor: 3.8 }, { valor: 4.0 }, { valor: 3.9 }] },
    personal: { notas: [{ valor: 4.2 }, { valor: null }, { valor: 4.0 }] },
    social: { notas: [{ valor: 4.0 }, { valor: 3.7 }, { valor: null }] }
  },
];

// Función para generar el horario
const generarHorario = (): HorarioClase[] => {
  const horario: HorarioClase[] = [];
  const dias = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  const horas = ['7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', '10:40 - 11:40', '11:40 - 12:40', '12:40 - 13:40', '14:20 - 15:20', '15:20 - 16:20'];
  const grados = [6, 7, 8, 9, 10, 11];
  const grupos = ['A', 'B', 'C', 'D'];

  const profesoresDisponibles = [...profesores];
  const asignaturasDisponibles = [...asignaturas];

  for (const grado of grados) {
    for (const grupo of grupos) {
      for (const dia of dias) {
        for (const hora of horas) {
          const asignaturasGrado = asignaturasDisponibles.filter(a => a.grados.includes(grado));
          if (asignaturasGrado.length > 0) {
            const asignaturaIndex = Math.floor(Math.random() * asignaturasGrado.length);
            const asignatura = asignaturasGrado[asignaturaIndex];
            
            const profesoresAsignatura = profesoresDisponibles.filter(p => p.asignaturas.includes(asignatura.nombre));
            if (profesoresAsignatura.length > 0) {
              const profesorIndex = Math.floor(Math.random() * profesoresAsignatura.length);
              const profesor = profesoresAsignatura[profesorIndex];

              const profesorOcupado = horario.some(clase => 
                clase.dia === dia && 
                clase.hora === hora && 
                clase.profesor === profesor.nombre
              );

              if (!profesorOcupado) {
                horario.push({
                  dia,
                  hora,
                  asignatura: asignatura.nombre,
                  profesor: profesor.nombre,
                  grado,
                  grupo
                });
              }
            }
          }
        }
      }
    }
  }

  return horario;
};

const horarioCompleto = generarHorario();

export default function SistemaEscolar() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [calificaciones, setCalificaciones] = useState<Calificacion[]>([]);
  const [horario, setHorario] = useState<HorarioClase[]>([]);
  const [identificacion, setIdentificacion] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const iniciarSesion = () => {
    const usuarioEncontrado = usuariosEjemplo.find(u => u.id === identificacion && identificacion.split('.')[1] === contrasena);
    if (usuarioEncontrado) {
      setUsuario(usuarioEncontrado);
      if (usuarioEncontrado.rol === 'estudiante') {
        setCalificaciones(calificacionesEjemplo);
        setHorario(horarioCompleto.filter(clase => clase.grado === usuarioEncontrado.grado && clase.grupo === usuarioEncontrado.grupo));
      } else if (usuarioEncontrado.rol === 'profesor') {
        const profesorEncontrado = profesores.find(p => p.nombre === usuarioEncontrado.nombre);
        if (profesorEncontrado) {
          setHorario(horarioCompleto.filter(clase => clase.profesor === profesorEncontrado.nombre));
        }
      }
      setError('');
    } else {
      setError('Credenciales inválidas');
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setCalificaciones([]);
    setHorario([]);
    setIdentificacion('');
    setContrasena('');
  };

  if (!usuario) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-4 text-[#002e83]">Iniciar Sesión</h1>
          <form onSubmit={(e) => { e.preventDefault(); iniciarSesion(); }} className="space-y-4">
            <div>
              <label htmlFor="identificacion" className="block text-sm font-medium text-gray-700">
                Identificación
              </label>
              <Input
                type="text"
                id="identificacion"
                value={identificacion}
                onChange={(e) => setIdentificacion(e.target.value)}
                placeholder="iide.1234567890"
                className="mt-1"
              />
            </div>
            <div>
              <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <Input
                type="password"
                id="contrasena"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="mt-1"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full bg-[#f77700] hover:bg-[#e66600]">
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </div>
    );
  }

    const [filtroDesempeno, setFiltroDesempeno] = useState({
        grado: '',
        grupo: '',
        area: '',
        asignatura: '',
        semestre: '',
        estudiante: ''
    });

    const [desempenos, setDesempenos] = useState<Desempeno[]>([]);
    const [desempenosAsignatura, setDesempenosAsignatura] = useState<DesempenoAsignatura[]>([]);
    const [desempenosGrado, setDesempenosGrado] = useState<DesempenoGrado[]>([]);
    const [desempenosGrupo, setDesempenosGrupo] = useState<DesempenoGrupo[]>([]);
    const [promediosPuestos, setPromediosPuestos] = useState<PromediosPuestos[]>([]);
    const [eventosInstitucionales, setEventosInstitucionales] = useState<EventoInstitucional[]>([]);

    const generarPDF = (contenido: string, nombreArchivo: string) => {
        // Aquí iría la lógica para generar un PDF
        console.log(`Generando PDF: ${nombreArchivo}`);
    };

  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#002e83]">
      <nav className="bg-[#f77700] p-4 text-white flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sistema Escolar</h1>
        <div className="flex items-center space-x-4">
          <Bell className="cursor-pointer" />
          <User className="cursor-pointer" />
          <Button onClick={cerrarSesion} variant="ghost">
            <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </nav>

      <div className="container mx-auto mt-8">
        <Tabs defaultValue="dashboard">
          <TabsList className="bg-[#002e83] text-white p-2 rounded-t-lg overflow-x-auto whitespace-nowrap">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            {usuario.rol === 'estudiante' && (
              <>
                <TabsTrigger value="calificaciones">Mis Calificaciones</TabsTrigger>
                <TabsTrigger value="horario">Mi Horario</TabsTrigger>
                <TabsTrigger value="datos-personales">Mis Datos Personales</TabsTrigger>
              </>
            )}
            {['profesor', 'administrador', 'superadmin'].includes(usuario.rol) && (
              <>
                <TabsTrigger value="comunidad">Comunidad</TabsTrigger>
                <TabsTrigger value="calificaciones">Calificaciones</TabsTrigger>
                <TabsTrigger value="desempenos">Desempeños</TabsTrigger>
                <TabsTrigger value="boletines">Boletines</TabsTrigger>
                <TabsTrigger value="listados">Listados de Estudiantes</TabsTrigger>
                <TabsTrigger value="promedios">Promedios y Puestos</TabsTrigger>
              </>
            )}
            {['administrador', 'superadmin'].includes(usuario.rol) && (
              <TabsTrigger value="institucional">Institucional</TabsTrigger>
            )}
            <TabsTrigger value="mi-cuenta">Mi Cuenta</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Bienvenido, {usuario.nombre}</h2>
            {usuario.rol === 'estudiante' && (
              <div>
                <p>Grado: {usuario.grado}</p>
                <p>Grupo: {usuario.grupo}</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">Próximas Clases</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>Profesor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {horario.slice(0, 3).map((clase, index) => (
                      <TableRow key={index}>
                        <TableCell>{clase.hora}</TableCell>
                        <TableCell>{clase.asignatura}</TableCell>
                        <TableCell>{clase.profesor}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {usuario.rol === 'profesor' && (
              <div>
                <p>Rol: Profesor</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">Próximas Clases</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hora</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>Grado</TableHead>
                      <TableHead>Grupo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {horario.slice(0, 5).map((clase, index) => (
                      <TableRow key={index}>
                        <TableCell>{clase.hora}</TableCell>
                        <TableCell>{clase.asignatura}</TableCell>
                        <TableCell>{clase.grado}</TableCell>
                        <TableCell>{clase.grupo}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {usuario.rol === 'administrador' && (
              <div>
                <p>Rol: Administrador</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">Resumen del Sistema</h3>
                <ul className="list-disc list-inside">
                  <li>Total de estudiantes: 500</li>
                  <li>Total de profesores: 30</li>
                  <li>Grupos activos: 20</li>
                  <li>Promedio general: 3.8</li>
                </ul>
              </div>
            )}
            {usuario.rol === 'superadmin' && (
              <div>
                <p>Rol: Superadministrador</p>
                <h3 className="text-xl font-semibold mt-4 mb-2">Estado del Sistema</h3>
                <ul className="list-disc list-inside">
                  <li>Usuarios activos: 550</li>
                  <li>Último respaldo: 2023-05-15 08:00</li>
                  <li>Versión del sistema: 2.3.1</li>
                  <li>Notificaciones pendientes: 5</li>
                </ul>
              </div>
            )}
          </TabsContent>

          <TabsContent value="calificaciones" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Calificaciones</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asignatura</TableHead>
                  <TableHead>Cognitivo (50%)</TableHead>
                  <TableHead>Personal (25%)</TableHead>
                  <TableHead>Social (25%)</TableHead>
                  <TableHead>Promedio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {calificaciones.map((cal, index) => {
                  const cognitivo = calcularPromedioComponente(cal.cognitivo) / 3;
                  const personal = calcularPromedioComponente(cal.personal) / 3;
                  const social = calcularPromedioComponente(cal.social) / 3;
                  const promedio = (cognitivo * 0.5) + (personal * 0.25) + (social * 0.25);

                  return (
                    <TableRow key={index}>
                      <TableCell>{cal.asignatura}</TableCell>
                      <TableCell>{cognitivo.toFixed(2)}</TableCell>
                      <TableCell>{personal.toFixed(2)}</TableCell>
                      <TableCell>{social.toFixed(2)}</TableCell>
                      <TableCell>{promedio.toFixed(2)}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="horario" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Mi Horario</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Hora</TableHead>
                  <TableHead>Lunes</TableHead>
                  <TableHead>Martes</TableHead>
                  <TableHead>Miércoles</TableHead>
                  <TableHead>Jueves</TableHead>
                  <TableHead>Viernes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {['7:00 - 8:00', '8:00 - 9:00', '9:00 - 10:00', '10:40 - 11:40', '11:40 - 12:40', '12:40 - 13:40', '14:20 - 15:20', '15:20 - 16:20'].map((hora, index) => (
                  <TableRow key={index}>
                    <TableCell>{hora}</TableCell>
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].map((dia, diaIndex) => {
                      const clase = horario.find(c => c.dia === dia && c.hora === hora);
                      return (
                        <TableCell key={diaIndex}>
                          {clase ? `${clase.asignatura} - ${clase.profesor}` : '-'}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="datos-personales" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Mis Datos Personales</h2>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">Nombre completo:</p>
                <p>{usuario.nombre}</p>
              </div>
              <div>
                <p className="font-semibold">Identificación:</p>
                <p>{usuario.id}</p>
              </div>
              <div>
                <p className="font-semibold">Grado:</p>
                <p>{usuario.grado}</p>
              </div>
              <div>
                <p className="font-semibold">Grupo:</p>
                <p>{usuario.grupo}</p>
              </div>
              {/* Aquí se pueden agregar más datos personales */}
            </div>
          </TabsContent>

          <TabsContent value="comunidad" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Comunidad Educativa</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold">Estudiantes</h3>
                <p>Total de estudiantes: 500</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Profesores</h3>
                <p>Total de profesores: 30</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Personal Administrativo</h3>
                <p>Total de personal administrativo: 15</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="desempenos" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Desempeños</h2>
            <Tabs>
              <TabsList>
                <TabsTrigger value="areas">Por Áreas</TabsTrigger>
                <TabsTrigger value="asignaturas">Por Asignaturas</TabsTrigger>
                <TabsTrigger value="grados">Por Grados</TabsTrigger>
                <TabsTrigger value="grupos">Por Grupos</TabsTrigger>
                <TabsTrigger value="estudiantes">Por Estudiantes</TabsTrigger>
              </TabsList>
              <TabsContent value="areas">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="grado">Grado</Label>
                        <Select id="grado" value={filtroDesempeno.grado} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grado: e.target.value})}>
                          {/* Opciones de grado */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="grupo">Grupo</Label>
                        <Select id="grupo" value={filtroDesempeno.grupo} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grupo: e.target.value})}>
                          {/* Opciones de grupo */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="area">Área</Label>
                        <Select id="area" value={filtroDesempeno.area} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, area: e.target.value})}>
                          {/* Opciones de área */}
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Área</TableHead>
                      <TableHead>Nombre de Estudiante</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>IH</TableHead>
                      <TableHead>Nota Total Semestre 1</TableHead>
                      <TableHead>Nota Total Semestre 2</TableHead>
                      <TableHead>Valoración Final</TableHead>
                      <TableHead>Valoración en Letras</TableHead>
                      <TableHead>Valoración requerida para aprobar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenos.map((desempeno, index) => (
                      <TableRow key={index}>
                        <TableCell>{desempeno.area}</TableCell>
                        <TableCell>{desempeno.estudiante}</TableCell>
                        <TableCell>{desempeno.asignatura}</TableCell>
                        <TableCell>{desempeno.intensidadHoraria}</TableCell>
                        <TableCell>{desempeno.notaSemestre1}</TableCell>
                        <TableCell>{desempeno.notaSemestre2}</TableCell>
                        <TableCell>{desempeno.valoracionFinal}</TableCell>
                        <TableCell>{desempeno.valoracionLetras}</TableCell>
                        <TableCell>{desempeno.valoracionRequerida}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="asignaturas">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="grado">Grado</Label>
                        <Select id="grado" value={filtroDesempeno.grado} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grado: e.target.value})}>
                          {/* Opciones de grado */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="grupo">Grupo</Label>
                        <Select id="grupo" value={filtroDesempeno.grupo} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grupo: e.target.value})}>
                          {/* Opciones de grupo */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="area">Área</Label>
                        <Select id="area" value={filtroDesempeno.area} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, area: e.target.value})}>
                          {/* Opciones de área */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="asignatura">Asignatura</Label>
                        <Select id="asignatura" value={filtroDesempeno.asignatura} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, asignatura: e.target.value})}>
                          {/* Opciones de asignatura */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="semestre">Semestre</Label>
                        <Select id="semestre" value={filtroDesempeno.semestre} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, semestre: e.target.value})}>
                          <option value="1">Semestre 1</option>
                          <option value="2">Semestre 2</option>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre de Estudiante</TableHead>
                      <TableHead>Nota Cognitiva</TableHead>
                      <TableHead>Nota Personal</TableHead>
                      <TableHead>Nota Social</TableHead>
                      <TableHead>Valoración del semestre</TableHead>
                      <TableHead>Valoración Final</TableHead>
                      <TableHead>Valoración en Letras</TableHead>
                      <TableHead>Valoración requerida para aprobar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenosAsignatura.map((desempeno, index) => (
                      <TableRow key={index}>
                        <TableCell>{desempeno.estudiante}</TableCell>
                        <TableCell>{desempeno.notaCognitiva}</TableCell>
                        <TableCell>{desempeno.notaPersonal}</TableCell>
                        <TableCell>{desempeno.notaSocial}</TableCell>
                        <TableCell>{desempeno.valoracionSemestre}</TableCell>
                        <TableCell>{desempeno.valoracionFinal}</TableCell>
                        <TableCell>{desempeno.valoracionLetras}</TableCell>
                        <TableCell>{desempeno.valoracionRequerida}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="grados">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label htmlFor="grado">Grado</Label>
                      <Select id="grado" value={filtroDesempeno.grado} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grado: e.target.value})}>
                        {/* Opciones de grado */}
                      </Select>
                    </div>
                  </CardContent>
                </Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grado</TableHead>
                      <TableHead>Estudiantes Totales</TableHead>
                      <TableHead>Áreas Totales</TableHead>
                      <TableHead>Asignaturas Totales</TableHead>
                      <TableHead>Áreas Perdidas</TableHead>
                      <TableHead>Áreas Ganadas</TableHead>
                      <TableHead>Promedio de Asignaturas Perdidas</TableHead>
                      <TableHead>Promedio de Asignaturas Ganadas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenosGrado.map((desempeno, index) => (
                      <TableRow key={index}>
                        <TableCell>{desempeno.grado}</TableCell>
                        <TableCell>{desempeno.estudiantesTotales}</TableCell>
                        <TableCell>{desempeno.areasTotales}</TableCell>
                        <TableCell>{desempeno.asignaturasTotales}</TableCell>
                        <TableCell>{desempeno.areasPerdidas}</TableCell>
                        <TableCell>{desempeno.areasGanadas}</TableCell>
                        <TableCell>{desempeno.promedioAsignaturasPerdidas}</TableCell>
                        <TableCell>{desempeno.promedioAsignaturasGanadas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="grupos">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="grado">Grado</Label>
                        <Select id="grado" value={filtroDesempeno.grado} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grado: e.target.value})}>
                          {/* Opciones de grado */}
                        </Select>
                      </div>
                      <div>
                
                        <Label htmlFor="grupo">Grupo</Label>
                        <Select id="grupo" value={filtroDesempeno.grupo} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grupo: e.target.value})}>
                          {/* Opciones de grupo */}
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Grado</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead>Estudiantes Totales</TableHead>
                      <TableHead>Áreas Totales</TableHead>
                      <TableHead>Asignaturas Totales</TableHead>
                      <TableHead>Áreas Perdidas</TableHead>
                      <TableHead>Áreas Ganadas</TableHead>
                      <TableHead>Promedio de Asignaturas Perdidas</TableHead>
                      <TableHead>Promedio de Asignaturas Ganadas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenosGrupo.map((desempeno, index) => (
                      <TableRow key={index}>
                        <TableCell>{desempeno.grado}</TableCell>
                        <TableCell>{desempeno.grupo}</TableCell>
                        <TableCell>{desempeno.estudiantesTotales}</TableCell>
                        <TableCell>{desempeno.areasTotales}</TableCell>
                        <TableCell>{desempeno.asignaturasTotales}</TableCell>
                        <TableCell>{desempeno.areasPerdidas}</TableCell>
                        <TableCell>{desempeno.areasGanadas}</TableCell>
                        <TableCell>{desempeno.promedioAsignaturasPerdidas}</TableCell>
                        <TableCell>{desempeno.promedioAsignaturasGanadas}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="estudiantes">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="grado">Grado</Label>
                        <Select id="grado" value={filtroDesempeno.grado} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grado: e.target.value})}>
                          {/* Opciones de grado */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="grupo">Grupo</Label>
                        <Select id="grupo" value={filtroDesempeno.grupo} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grupo: e.target.value})}>
                          {/* Opciones de grupo */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="area">Área</Label>
                        <Select id="area" value={filtroDesempeno.area} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, area: e.target.value})}>
                          {/* Opciones de área */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="asignatura">Asignatura</Label>
                        <Select id="asignatura" value={filtroDesempeno.asignatura} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, asignatura: e.target.value})}>
                          {/* Opciones de asignatura */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="semestre">Semestre</Label>
                        <Select id="semestre" value={filtroDesempeno.semestre} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, semestre: e.target.value})}>
                          <option value="1">Semestre 1</option>
                          <option value="2">Semestre 2</option>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="estudiante">Estudiante</Label>
                        <Select id="estudiante" value={filtroDesempeno.estudiante} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, estudiante: e.target.value})}>
                          {/* Opciones de estudiante */}
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Área</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>Nota Cognitiva</TableHead>
                      <TableHead>Nota Personal</TableHead>
                      <TableHead>Nota Social</TableHead>
                      <TableHead>Valoración del semestre</TableHead>
                      <TableHead>Valoración Final</TableHead>
                      <TableHead>Valoración en Letras</TableHead>
                      <TableHead>Valoración requerida para aprobar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenosAsignatura.map((desempeno, index) => (
                      <TableRow key={index}>
                        <TableCell>{filtroDesempeno.area}</TableCell>
                        <TableCell>{filtroDesempeno.asignatura}</TableCell>
                        <TableCell>{desempeno.notaCognitiva}</TableCell>
                        <TableCell>{desempeno.notaPersonal}</TableCell>
                        <TableCell>{desempeno.notaSocial}</TableCell>
                        <TableCell>{desempeno.valoracionSemestre}</TableCell>
                        <TableCell>{desempeno.valoracionFinal}</TableCell>
                        <TableCell>{desempeno.valoracionLetras}</TableCell>
                        <TableCell>{desempeno.valoracionRequerida}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="boletines" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Boletines</h2>
            <Tabs>
              <TabsList>
                <TabsTrigger value="grupo">Por Grupo</TabsTrigger>
                <TabsTrigger value="estudiante">Por Estudiante</TabsTrigger>
              </TabsList>
              <TabsContent value="grupo">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="grado">Grado</Label>
                        <Select id="grado" value={filtroDesempeno.grado} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grado: e.target.value})}>
                          {/* Opciones de grado */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="grupo">Grupo</Label>
                        <Select id="grupo" value={filtroDesempeno.grupo} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grupo: e.target.value})}>
                          {/* Opciones de grupo */}
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Área</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>Nota Cognitiva</TableHead>
                      <TableHead>Nota Personal</TableHead>
                      <TableHead>Nota Social</TableHead>
                      <TableHead>Valoración del semestre</TableHead>
                      <TableHead>Valoración Final</TableHead>
                      <TableHead>Valoración en Letras</TableHead>
                      <TableHead>Valoración requerida para aprobar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenosAsignatura.map((desempeno, index) => (
                      <TableRow key={index}>
                        <TableCell>{filtroDesempeno.area}</TableCell>
                        <TableCell>{filtroDesempeno.asignatura}</TableCell>
                        <TableCell>{desempeno.notaCognitiva}</TableCell>
                        <TableCell>{desempeno.notaPersonal}</TableCell>
                        <TableCell>{desempeno.notaSocial}</TableCell>
                        <TableCell>{desempeno.valoracionSemestre}</TableCell>
                        <TableCell>{desempeno.valoracionFinal}</TableCell>
                        <TableCell>{desempeno.valoracionLetras}</TableCell>
                        <TableCell>{desempeno.valoracionRequerida}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button onClick={() => generarPDF('contenido del boletín', 'boletin_grupo.pdf')}>
                  <Printer className="mr-2 h-4 w-4" /> Imprimir Boletín
                </Button>
              </TabsContent>
              <TabsContent value="estudiante">
                <Card>
                  <CardHeader>
                    <CardTitle>Filtros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="grado">Grado</Label>
                        <Select id="grado" value={filtroDesempeno.grado} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grado: e.target.value})}>
                          {/* Opciones de grado */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="grupo">Grupo</Label>
                        <Select id="grupo" value={filtroDesempeno.grupo} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grupo: e.target.value})}>
                          {/* Opciones de grupo */}
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="estudiante">Estudiante</Label>
                        <Select id="estudiante" value={filtroDesempeno.estudiante} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, estudiante: e.target.value})}>
                          {/* Opciones de estudiante */}
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Área</TableHead>
                      <TableHead>Asignatura</TableHead>
                      <TableHead>IH</TableHead>
                      <TableHead>Nota Total Semestre 1</TableHead>
                      <TableHead>Nota Total Semestre 2</TableHead>
                      <TableHead>Valoración Final</TableHead>
                      <TableHead>Valoración en Letras</TableHead>
                      <TableHead>Valoración requerida para aprobar</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {desempenos.map((desempeno, index) => (
                      <TableRow key={index}>
                        <TableCell>{desempeno.area}</TableCell>
                        <TableCell>{desempeno.asignatura}</TableCell>
                        <TableCell>{desempeno.intensidadHoraria}</TableCell>
                        <TableCell>{desempeno.notaSemestre1}</TableCell>
                        <TableCell>{desempeno.notaSemestre2}</TableCell>
                        <TableCell>{desempeno.valoracionFinal}</TableCell>
                        <TableCell>{desempeno.valoracionLetras}</TableCell>
                        <TableCell>{desempeno.valoracionRequerida}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Button onClick={() => generarPDF('contenido del boletín', 'boletin_estudiante.pdf')}>
                  <Printer className="mr-2 h-4 w-4" /> Imprimir Boletín
                </Button>
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="listados" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Listados de Estudiantes</h2>
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="grado">Grado</Label>
                    <Select id="grado" value={filtroDesempeno.grado} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grado: e.target.value})}>
                      {/* Opciones de grado */}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="grupo">Grupo</Label>
                    <Select id="grupo" value={filtroDesempeno.grupo} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grupo: e.target.value})}>
                      {/* Opciones de grupo */}
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Grado</TableHead>
                  <TableHead>Grupo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Aquí irían los estudiantes filtrados */}
              </TableBody>
            </Table>
            <div className="mt-4 space-x-4">
              <Button onClick={() => generarPDF('listado de estudiantes por grado', 'listado_grado.pdf')}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir por Grado
              </Button>
              <Button onClick={() => generarPDF('listado de estudiantes por grupo', 'listado_grupo.pdf')}>
                <Printer className="mr-2 h-4 w-4" /> Imprimir por Grupo
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="promedios" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Promedios y Puestos</h2>
            <Card>
              <CardHeader>
                <CardTitle>Filtros</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="grado">Grado</Label>
                    <Select id="grado" value={filtroDesempeno.grado} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grado: e.target.value})}>
                      {/* Opciones de grado */}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="grupo">Grupo</Label>
                    <Select id="grupo" value={filtroDesempeno.grupo} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, grupo: e.target.value})}>
                      {/* Opciones de grupo */}
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="semestre">Semestre</Label>
                    <Select id="semestre" value={filtroDesempeno.semestre} onChange={(e) => setFiltroDesempeno({...filtroDesempeno, semestre: e.target.value})}>
                      <option value="1">Semestre 1</option>
                      <option value="2">Semestre 2</option>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Grupo</TableHead>
                  <TableHead>Semestre</TableHead>
                  <TableHead>Estudiante</TableHead>
                  <TableHead>Áreas con desempeño Superior (4.7 a 5.0)</TableHead>
                  <TableHead>Áreas con desempeño Alto (4.0 a 4.7)</TableHead>
                  <TableHead>Áreas con desempeño Básico (3.0 a 3.9)</TableHead>
                  <TableHead>Áreas con desempeño Bajo (1.0 a 3.0)</TableHead>
                  <TableHead>Promedio General Calculado (PGC)</TableHead>
                  <TableHead>Promedio General Guardado (PGG)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promediosPuestos.map((promedio, index) => (
                  <TableRow key={index}>
                    <TableCell>{filtroDesempeno.grupo}</TableCell>
                    <TableCell>{filtroDesempeno.semestre}</TableCell>
                    <TableCell>{promedio.estudiante}</TableCell>
                    <TableCell>{promedio.areasDesempenoSuperior}</TableCell>
                    <TableCell>{promedio.areasDesempenoAlto}</TableCell>
                    <TableCell>{promedio.areasDesempenoBasico}</TableCell>
                    <TableCell>{promedio.areasDesempenoBajo}</TableCell>
                    <TableCell>{promedio.promedioGeneralCalculado}</TableCell>
                    <TableCell>{promedio.promedioGeneralGuardado}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="institucional" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Gestión Institucional</h2>
            <Card>
              <CardHeader>
                <CardTitle>Calendario Académico</CardTitle>
                <CardDescription>Gestiona los eventos y fechas importantes del año lectivo</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div>
                    <Label htmlFor="evento">Nombre del Evento</Label>
                    <Input id="evento" placeholder="Ej: Inicio de clases" />
                  </div>
                  <div>
                    <Label>Fecha del Evento</Label>
                    <DatePickerWithRange />
                  </div>
                  <div>
                    <Label htmlFor="tipo">Tipo de Evento</Label>
                    <Select id="tipo">
                      <option value="clase">Clase</option>
                      <option value="vacaciones">Vacaciones</option>
                      <option value="evento">Evento</option>
                      <option value="calificaciones">Calificaciones</option>
                    </Select>
                  </div>
                  <Button type="submit">Agregar Evento</Button>
                </form>
              </CardContent>
            </Card>
            <Table className="mt-4">
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre del Evento</TableHead>
                  <TableHead>Fecha de Inicio</TableHead>
                  <TableHead>Fecha de Fin</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {eventosInstitucionales.map((evento, index) => (
                  <TableRow key={index}>
                    <TableCell>{evento.nombre}</TableCell>
                    <TableCell>{evento.fechaInicio.toLocaleDateString()}</TableCell>
                    <TableCell>{evento.fechaFin.toLocaleDateString()}</TableCell>
                    <TableCell>{evento.tipo}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="mi-cuenta" className="bg-white p-6 rounded-b-lg shadow">
            <h2 className="text-2xl font-bold mb-4">Mi Cuenta</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Nueva Contraseña
                </label>
                <Input type="password" id="password" className="mt-1" />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  Confirmar Nueva Contraseña
                </label>
                <Input type="password" id="confirm-password" className="mt-1" />
              </div>
              <Button type="submit">Cambiar Contraseña</Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
