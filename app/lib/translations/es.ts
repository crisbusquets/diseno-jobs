export const BENEFITS_PRESETS = {
  healthInsurance: {
    id: "health",
    name: "Seguro médico privado",
    icon: "🏥",
  },
  dentalInsurance: {
    id: "dental",
    name: "Seguro dental",
    icon: "🦷",
  },
  remoteWork: {
    id: "remote",
    name: "Teletrabajo flexible",
    icon: "🏠",
  },
  flexibleHours: {
    id: "flextime",
    name: "Horario flexible",
    icon: "⏰",
  },
  training: {
    id: "training",
    name: "Formación continua",
    icon: "📚",
  },
  equipment: {
    id: "equipment",
    name: "Presupuesto para equipo",
    icon: "💻",
  },
  pension: {
    id: "pension",
    name: "Plan de pensiones",
    icon: "💰",
  },
  mealAllowance: {
    id: "meal",
    name: "Ticket restaurante",
    icon: "🍽️",
  },
  gym: {
    id: "gym",
    name: "Gimnasio",
    icon: "💪",
  },
  extraDays: {
    id: "extradays",
    name: "Días libres extra",
    icon: "🌴",
  },
} as const;

export const translations = {
  common: {
    loading: "Cargando...",
    error: "Ha ocurrido un error",
    save: "Guardar",
    saving: "Guardando...",
    cancel: "Cancelar",
    edit: "Editar",
    delete: "Eliminar",
    copy: "Copiar",
    copied: "Copiado",
  },
  benefits: {
    presets: BENEFITS_PRESETS,
  },
  jobs: {
    apply: {
      title: "¿Te interesa esta posición?",
      email: {
        button: "Enviar email",
        description: "Se abrirá tu cliente de email para enviar tu aplicación",
      },
      url: {
        button: "Aplicar ahora",
        description: "Serás redirigido al formulario de aplicación",
      },
      errors: {
        email: "Error al abrir el cliente de email",
        url: "Error al abrir el enlace",
      },
    },
    application: {
      title: "Como postular",
      email: {
        label: "Email",
        placeholder: "info@dominio.com",
        help: "Los candidatos recibirán un botón para enviar email directamente",
      },
      url: {
        label: "URL",
        placeholder: "https://dominio.com/empleo/oferta",
        help: "Los candidatos serán redirigidos a esta URL para aplicar",
      },
    },
    benefits: {
      label: "Beneficios",
    },
    create: {
      title: "Publicar oferta de empleo de diseño",
      duration: "Publicación visible durante 30 días",
      visibility: "Visible para toda la comunidad de diseño",
      pricing: "{{price}}€",
      pricingNote: "Pago único",
      logo: {
        upload: "Subir logo",
        uploadFormat: "PNG, JPG o SVG (máx. 2MB)",
      },
      company: {
        title: "Información de la empresa",
        titleLabel: "Empresa",
        description: "Datos sobre tu empresa y cómo contactarte",
        placeholder: "ej., Design Studio Inc.",
        emailLabel: "Email",
        emailHelp: "Se usará para gestionar la oferta y recibir notificaciones",
        logo: "Logo de la empresa",
      },
      details: {
        title: "Detalles del puesto",
        description: "Información sobre la posición y requisitos",
        titleLabel: "Título del puesto",
        titlePlaceholder: "ej., Diseñador/a UX Senior",
      },
      buttons: {
        continue: "Continuar con el pago",
        processing: "Procesando...",
      },
      terms: "Al continuar, aceptas nuestros términos y condiciones",
      validation: {
        required: "{{field}} es obligatorio",
        email: "Email no válido",
        applyEmail: "Email de aplicación no válido",
        url: "La URL debe comenzar con http:// o https://",
        salary: "El salario mínimo no puede ser mayor que el máximo",
      },
    },
    filters: {
      clear: "Limpiar filtros",
      remote: "Solo remoto",
    },
    form: {
      company: "Nombre de la empresa",
      email: "Email de la empresa",
      details: {
        title: "Detalles del puesto",
        description: "Información sobre la posición y requisitos",
      },
      workMode: {
        label: "Modalidad de trabajo",
        placeholder: "Selecciona una modalidad",
        remote: "Remoto",
        hybrid: "Híbrido",
        onsite: "Presencial",
      },
      experience: {
        label: "Nivel de experiencia",
        placeholder: "Selecciona un nivel",
        entry: "Entry level",
        junior: "Junior",
        mid: "Mid",
        senior: "Senior",
        manager: "Manager",
        lead: "Lead",
      },
      contract: {
        label: "Tipo de contrato",
        placeholder: "Selecciona una opción",
        fulltime: "Jornada completa",
        parttime: "Media jornada",
        internship: "Prácticas",
        freelance: "Freelance",
      },
      salary: {
        min: "Salario mínimo (€)",
        max: "Salario máximo (€)",
        placeholder: {
          min: "ej., 45.000",
          max: "ej., 60.000",
        },
      },
      description: {
        label: "Descripción del puesto",
        placeholder: "Describe el rol, responsabilidades, requisitos...",
      },
      benefits: {
        title: "Beneficios y proceso de aplicación",
        description: "Beneficios de la empresa y cómo aplicar al puesto",
      },
    },
    location: {
      label: "Ubicación",
    },
    manage: {
      title: "Gestionar la oerta",
      status: {
        active: "Oferta activa",
        inactive: "Oferta inactiva",
      },
      dates: {
        published: "Publicada el {{date}}",
        activated: "Activada el {{date}}",
      },
      preview: {
        tab: "Vista previa",
        button: "Editar información",
      },
      edit: {
        tab: "Editar",
        success: "La oferta se ha actualizado correctamente",
      },
      deactivate: {
        button: "Desactivar oferta",
        confirm: {
          title: "¿Estás seguro?",
          description:
            "Al desactivar la oferta, dejará de ser visible en el listado. Esta acción no se puede deshacer.",
          cancel: "Cancelar",
          confirm: "Desactivar",
        },
      },
    },
    results: {
      count: "{{count}} oferta{{plural}} encontrada{{plural}}",
      empty: {
        title: "No se encontraron ofertas",
        description: "Prueba a cambiar los filtros de búsqueda",
      },
    },
    salary: {
      label: "Salario",
      minimum: "Salario mínimo",
      placeholder: "Ej: 30.000",
      notSpecified: "No especificado",
    },
    search: {
      label: "Búsqueda",
      placeholder: "Título o empresa...",
    },
    type: {
      label: "Tipo de trabajo",
      all: "Todos",
    },
  },
  pending: "Pendiente",
  actions: {
    create: "Publicar empleo",
    edit: "Editar oferta",
    deactivate: "Desactivar oferta",
    view: "Ver oferta",
  },
  site: {
    name: "DisñoJobs",
    navigation: {
      home: "Inicio",
      post: "Publicar empleo",
    },
  },
  toasts: {
    deactivateOfferSuccess: {
      title: "Oferta desactivada",
      description: "La oferta ya no será visible en el listado",
    },
    deactivateOfferError: "Error al desactivar la oferta",
    openEmailClient: {
      title: "Abriendo cliente de email",
      description: "Se abrirá tu cliente de email para enviar la aplicación",
    },
    saveChanges: {
      title: "Cambios guardados",
      description: "Los cambios se han guardado correctamente",
      error: "Error al guardar los cambios",
    },
    submitError: "Error al procesar la solicitud",
    validationError: "Error de validación",
  },
};
