import { ProblemCategory, ReportStatus, SupportedLanguage, UrgencyLevel } from '../types';

export interface TranslationDictionary {
  appName: string;
  appTagline: string;
  civicDisclaimer: string;
  civicDisclaimerDetail: string;
  tabs: {
    dashboard: string;
    report: string;
    coordinator: string;
    guidance: string;
  };
  categories: Record<ProblemCategory, { label: string; description: string; icon: string }>;
  statuses: Record<ReportStatus, { label: string; badgeText: string; description: string }>;
  urgency: Record<UrgencyLevel, string>;
  form: {
    title: string;
    subtitle: string;
    fieldTitle: string;
    fieldTitlePlaceholder: string;
    fieldCategory: string;
    fieldCategoryHelp: string;
    fieldDescription: string;
    fieldDescriptionPlaceholder: string;
    fieldLocation: string;
    fieldLocationPlaceholder: string;
    gpsButton: string;
    gpsDetecting: string;
    gpsSuccess: string;
    gpsDenied: string;
    fieldPhoto: string;
    fieldPhotoHelp: string;
    fieldUrgency: string;
    privacyNote: string;
    submitButton: string;
    submittingButton: string;
    validationErrors: {
      titleRequired: string;
      categoryRequired: string;
      descriptionRequired: string;
      locationRequired: string;
      photoSizeError: string;
      photoTypeError: string;
    };
    successHeading: string;
    successMessage: string;
    successNotice: string;
    reportAnother: string;
    viewInDashboard: string;
  };
  dashboard: {
    heading: string;
    subtitle: string;
    statsTotal: string;
    statsUnresolved: string;
    statsInProgress: string;
    statsResolved: string;
    filterSearch: string;
    filterSearchPlaceholder: string;
    filterCategory: string;
    filterStatus: string;
    filterAll: string;
    sortBy: string;
    sortNewest: string;
    sortOldest: string;
    sortUrgency: string;
    noReportsFound: string;
    noReportsSub: string;
    viewDetails: string;
  };
  detail: {
    modalTitle: string;
    reportedOn: string;
    location: string;
    status: string;
    timelineHeading: string;
    timelineSubtitle: string;
    verifiedBadge: string;
    unverifiedBadge: string;
    coordinatorNoteBadge: string;
    close: string;
  };
  coordinator: {
    title: string;
    subtitle: string;
    loginRequired: string;
    loginPrompt: string;
    pinPlaceholder: string;
    loginButton: string;
    logoutButton: string;
    statusChangeHeading: string;
    selectNewStatus: string;
    actionNotePrompt: string;
    actionNotePlaceholder: string;
    proofPhotoPrompt: string;
    updateStatusBtn: string;
    duplicateBtn: string;
    flagBtn: string;
    internalNotesHeading: string;
    addNotePlaceholder: string;
    addNoteBtn: string;
    exportCsvBtn: string;
    filterDuplicates: string;
    filterFlagged: string;
  };
  guidance: {
    heading: string;
    subtitle: string;
    disclaimerBox: string;
    officialChannelsTitle: string;
    officialChannelsSub: string;
    segregationTitle: string;
    segregationSub: string;
  };
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: "CleanStreet",
    appTagline: "Community-Powered Sanitation Reporting Platform",
    civicDisclaimer: "Important Civic Notice: CleanStreet is an independent citizen coordination tool.",
    civicDisclaimerDetail: "Submitting a report here helps your neighborhood track and follow up on issues. It does not replace or guarantee response from official municipal authorities.",
    tabs: {
      dashboard: "Report Dashboard",
      report: "Report an Issue",
      coordinator: "Coordinator Panel",
      guidance: "Civic Guidance"
    },
    categories: {
      garbage_overflow: {
        label: "Garbage Overflow",
        description: "Bins overflowing, uncollected street dump heaps",
        icon: "🗑️"
      },
      litter: {
        label: "Litter in Public Spaces",
        description: "Scattered plastic, bottles, or waste in parks/sidewalks",
        icon: "🚯"
      },
      blocked_drain: {
        label: "Blocked Drain / Silt",
        description: "Choked storm water gutters, stagnant foul water",
        icon: "🌊"
      },
      illegal_dumping: {
        label: "Illegal Dumping",
        description: "Construction debris, commercial waste dumped in open plots",
        icon: "🚚"
      },
      other: {
        label: "Other Sanitation Issue",
        description: "Dead animal removal, broken public dustbin, etc.",
        icon: "⚠️"
      }
    },
    statuses: {
      submitted: {
        label: "Submitted",
        badgeText: "Awaiting Review",
        description: "Report filed by resident; pending coordinator verification."
      },
      under_review: {
        label: "Under Review",
        badgeText: "Under Review",
        description: "Coordinator has inspected the issue or verified details."
      },
      action_planned: {
        label: "Action Planned",
        badgeText: "Action Planned",
        description: "Delegated to community clean-up drive or escalated to municipal ward."
      },
      resolved: {
        label: "Resolved",
        badgeText: "Resolved & Verified",
        description: "Sanitation hazard cleared and verified with proof."
      },
      unable_to_resolve: {
        label: "Unable to Resolve",
        badgeText: "Unable to Resolve",
        description: "Issue requires specialized department intervention or private property."
      }
    },
    urgency: {
      normal: "Normal Priority",
      high: "High Priority (Public Path)",
      critical: "Critical (Health Hazard / Near School)"
    },
    form: {
      title: "Submit a Sanitation Report",
      subtitle: "Document local waste and sanitation problems in under 2 minutes.",
      fieldTitle: "Brief Title",
      fieldTitlePlaceholder: "e.g., Overflowing bin near Bus Stand #4",
      fieldCategory: "Problem Category",
      fieldCategoryHelp: "Choose the option that best describes what you observed",
      fieldDescription: "What did you observe?",
      fieldDescriptionPlaceholder: "Provide details such as size of heap, foul smell, stagnant water, or safety hazards...",
      fieldLocation: "Location / Landmark",
      fieldLocationPlaceholder: "e.g., Corner of 4th Cross and Gandhi Road, opposite Bakery",
      gpsButton: "Detect Approximate Location",
      gpsDetecting: "Detecting...",
      gpsSuccess: "Approx. GPS Location Saved (Protected)",
      gpsDenied: "GPS access not permitted. Please type a nearby landmark.",
      fieldPhoto: "Optional Photograph (Max 5MB)",
      fieldPhotoHelp: "Accepted formats: JPG, PNG, WEBP. Do not upload photos showing people's faces or private property.",
      fieldUrgency: "Sanitation Urgency Level",
      privacyNote: "CleanStreet protects resident privacy. Do not include personal phone numbers or private house addresses.",
      submitButton: "Submit Sanitation Report",
      submittingButton: "Saving Report...",
      validationErrors: {
        titleRequired: "Please enter a short title for this report.",
        categoryRequired: "Please select a problem category.",
        descriptionRequired: "Please provide a short description of the issue.",
        locationRequired: "Please describe the location or landmark.",
        photoSizeError: "Image size must be smaller than 5 MB.",
        photoTypeError: "Only JPEG, PNG, and WebP images are permitted."
      },
      successHeading: "Report Filed Successfully!",
      successMessage: "Your report has been assigned reference ID",
      successNotice: "A community coordinator will review this submission. You can track status updates directly in the Public Dashboard.",
      reportAnother: "Report Another Issue",
      viewInDashboard: "View on Dashboard"
    },
    dashboard: {
      heading: "Community Sanitation Dashboard",
      subtitle: "Live transparent tracking of neighborhood waste and cleanup actions.",
      statsTotal: "Total Reports",
      statsUnresolved: "Awaiting Review",
      statsInProgress: "Action In Progress",
      statsResolved: "Resolved & Cleaned",
      filterSearch: "Search Reports",
      filterSearchPlaceholder: "Search by ID, landmark, or description...",
      filterCategory: "Filter by Category",
      filterStatus: "Filter by Status",
      filterAll: "All Categories",
      sortBy: "Sort By",
      sortNewest: "Newest First",
      sortOldest: "Oldest First",
      sortUrgency: "Highest Urgency",
      noReportsFound: "No sanitation reports match your criteria.",
      noReportsSub: "Try clearing filters or search query to view all community reports.",
      viewDetails: "View Details & History"
    },
    detail: {
      modalTitle: "Sanitation Report Details",
      reportedOn: "Reported on",
      location: "Location",
      status: "Current Status",
      timelineHeading: "Status & Action History",
      timelineSubtitle: "Transparent timestamped audit trail of community and coordinator actions.",
      verifiedBadge: "Coordinator Verified",
      unverifiedBadge: "Community Submitted (Unverified)",
      coordinatorNoteBadge: "Action Note",
      close: "Close"
    },
    coordinator: {
      title: "Community Coordinator Portal",
      subtitle: "Manage, review, verify, and escalate neighborhood sanitation reports.",
      loginRequired: "Coordinator Access Verification",
      loginPrompt: "Please enter the authorized Community Coordinator Passcode to access administrative tools.",
      pinPlaceholder: "Enter Passcode (Default Demo: CLEAN2026)",
      loginButton: "Authorize Access",
      logoutButton: "Exit Coordinator Mode",
      statusChangeHeading: "Update Status & Log Action",
      selectNewStatus: "Select Updated Status",
      actionNotePrompt: "Describe action taken or scheduled (Mandatory for accountability)",
      actionNotePlaceholder: "e.g., Contacted ward sanitary inspector; sanitary team cleared silt on Oct 14th.",
      proofPhotoPrompt: "Resolution Proof Photo (Optional)",
      updateStatusBtn: "Record Status Update",
      duplicateBtn: "Mark as Duplicate",
      flagBtn: "Flag as Misleading",
      internalNotesHeading: "Internal Coordinator Notes (Staff Only)",
      addNotePlaceholder: "Add private follow-up note (e.g. Inspector mobile phone call notes)...",
      addNoteBtn: "Save Internal Note",
      exportCsvBtn: "Export Reports (CSV)",
      filterDuplicates: "Hide Duplicates",
      filterFlagged: "Show Flagged Only"
    },
    guidance: {
      heading: "Civic Awareness & Sanitation Guidance",
      subtitle: "Practical tips for maintaining neighborhood hygiene and escalating complaints.",
      disclaimerBox: "CleanStreet is an independent civic tool designed for community mutual aid and accountability. Always file emergency public health hazards through verified official municipal portals.",
      officialChannelsTitle: "Official Municipal Grievance Channels",
      officialChannelsSub: "Use these government services for formal statutory complaints:",
      segregationTitle: "Neighborhood Waste Segregation Guidelines",
      segregationSub: "Proper waste sorting at home prevents overflow and eases sanitation worker burden:"
    }
  },
  te: {
    appName: "క్లీన్ స్ట్రీట్ (CleanStreet)",
    appTagline: "ప్రజా పారిశుద్ధ్య సమస్యల నమోదు మరియు పరిష్కార వేదిక",
    civicDisclaimer: "ముఖ్యమైన పౌర గమనిక: క్లీన్ స్ట్రీట్ అనేది స్వతంత్ర పౌర సమన్వయ వేదిక.",
    civicDisclaimerDetail: "ఇక్కడ నివేదిక సమర్పించడం వలన మీ ప్రాంత సమస్యలను ట్రాక్ చేయవచ్చు. ఇది అధికారిక మునిసిపల్ ఫిర్యాదులకు ప్రత్యామ్నాయం కాదు.",
    tabs: {
      dashboard: "సమస్యల డ్యాష్‌బోర్డ్",
      report: "సమస్య నమోదు చేయండి",
      coordinator: "సమన్వయకర్త విభాగం",
      guidance: "పౌర మార్గదర్శకాలు"
    },
    categories: {
      garbage_overflow: {
        label: "చెత్త కుప్పలు / నిండిపోయిన డస్ట్‌బిన్లు",
        description: "రోడ్లపై పేరుకుపోయిన చెత్త, నిండిపోయిన చెత్త కుండీలు",
        icon: "🗑️"
      },
      litter: {
        label: "బహిరంగ ప్రదేశాల్లో చెత్త",
        description: "పార్కులు, ఫుట్‌పాత్‌లపై ప్లాస్టిక్ లేదా వ్యర్థాలు",
        icon: "🚯"
      },
      blocked_drain: {
        label: "మురుగు కాలువల పూడిక / నిలిచిన నీరు",
        description: "మూసుకుపోయిన డ్రైనేజీలు, దుర్వాసనతో కూడిన మురుగు నీరు",
        icon: "🌊"
      },
      illegal_dumping: {
        label: "నిబంధనలకు విరుద్ధంగా వ్యర్థాలు వేయడం",
        description: "నిర్మాణ వ్యర్థాలు (C&D waste), వాణిజ్య వ్యర్థాలు పారబోయడం",
        icon: "🚚"
      },
      other: {
        label: "ఇతర పారిశుద్ధ్య సమస్య",
        description: "చనిపోయిన జంతువుల తొలగింపు, పగిలిన డస్ట్‌బిన్లు మొదలైనవి",
        icon: "⚠️"
      }
    },
    statuses: {
      submitted: {
        label: "సమర్పించబడింది",
        badgeText: "పరిశీలనలో ఉంది",
        description: "పౌరుడు నివేదించారు; కోఆర్డినేటర్ పరిశీలనకు వేచి ఉంది."
      },
      under_review: {
        label: "పరిశీలన జరుగుతోంది",
        badgeText: "పరిశీలనలో",
        description: "సమన్వయకర్త ప్రదేశాన్ని పరిశీలించి సమస్యను నిర్ధారించారు."
      },
      action_planned: {
        label: "చర్య ప్రణాళిక రూపొందించబడింది",
        badgeText: "చర్య ప్రారంభం",
        description: "పారిశుద్ధ్య కార్మికులకు లేదా మునిసిపల్ వార్డుకు నివేదించబడింది."
      },
      resolved: {
        label: "పరిష్కరించబడింది",
        badgeText: "పరిష్కారం పూర్తి",
        description: "పారిశుద్ధ్య సమస్య తొలగించబడింది మరియు ధృవీకరించబడింది."
      },
      unable_to_resolve: {
        label: "పరిష్కరించడం వీలుపడలేదు",
        badgeText: "పరిష్కారం కాలేదు",
        description: "ప్రత్యేక శాఖ లేదా ప్రైవేట్ స్థలం అనుమతి అవసరం."
      }
    },
    urgency: {
      normal: "సాధారణ ప్రాధాన్యత",
      high: "అధిక ప్రాధాన్యత (ప్రజా రవాణా మార్గం)",
      critical: "అత్యవసర ప్రాధాన్యత (పాఠశాల / ఆసుపత్రి సమీపం)"
    },
    form: {
      title: "పారిశుద్ధ్య సమస్యను నమోదు చేయండి",
      subtitle: "కేవలం 2 నిమిషాల్లో మీ పరిసరాల్లోని సమస్యను రికార్డ్ చేయండి.",
      fieldTitle: "సంక్షిప్త శీర్షిక",
      fieldTitlePlaceholder: "ఉదాహరణ: బస్ స్టాప్ #4 వద్ద నిండిన చెత్త కుండీ",
      fieldCategory: "సమస్య వర్గం",
      fieldCategoryHelp: "మీరు గమనించిన సమస్యకు సరిపోయే విభాగాన్ని ఎంచుకోండి",
      fieldDescription: "సమస్య వివరణ",
      fieldDescriptionPlaceholder: "చెత్త పరిమాణం, దుర్వాసన, నిలిచిన నీరు లేదా ఇతర సమస్యలను వివరించండి...",
      fieldLocation: "స్థలం / సమీప ప్రదేశం (Landmark)",
      fieldLocationPlaceholder: "ఉదాహరణ: 4వ క్రాస్ రోడ్, గాంధీ విగ్రహం ఎదురుగా",
      gpsButton: "స్థలాన్ని GPS ద్వారా గుర్తించండి",
      gpsDetecting: "గుర్తిస్తోంది...",
      gpsSuccess: "GPS ప్రదేశం భద్రపరచబడింది",
      gpsDenied: "GPS అనుమతి లభించలేదు. దయచేసి సమీప ప్రదేశాన్ని టైప్ చేయండి.",
      fieldPhoto: "ఫోటో (ఐచ్ఛికం, గరిష్టంగా 5MB)",
      fieldPhotoHelp: "అనుమతించబడినవి: JPG, PNG, WEBP. వ్యక్తుల ముఖాలు లేకుండా తీయండి.",
      fieldUrgency: "సమస్య తీవ్రత",
      privacyNote: "గోప్యతా గమనిక: మీ వ్యక్తిగత ఫోన్ నంబర్లు లేదా ప్రైవేట్ ఇంటి వివరాలు ఇవ్వనవసరం లేదు.",
      submitButton: "సమస్యను సమర్పించండి",
      submittingButton: "భద్రపరుస్తోంది...",
      validationErrors: {
        titleRequired: "దయచేసి సమస్యకు శీర్షిక ఇవ్వండి.",
        categoryRequired: "దయచేసి ఒక వర్గాన్ని ఎంచుకోండి.",
        descriptionRequired: "దయచేసి సమస్య వివరాలను రాయండి.",
        locationRequired: "దయచేసి ప్రదేశం లేదా ల్యాండ్‌మార్క్ వివరాలు నమోదు చేయండి.",
        photoSizeError: "ఫోటో సైజు 5 MB కన్నా తక్కువ ఉండాలి.",
        photoTypeError: "కేవలం JPEG, PNG, లేదా WebP చిత్రాలను మాత్రమే అనుమతిస్తారు."
      },
      successHeading: "సమస్య విజయవంతంగా నమోదయింది!",
      successMessage: "మీ రిపోర్ట్ రిఫరెన్స్ నంబర్",
      successNotice: "మా సమన్వయకర్త దీనిని సమీక్షిస్తారు. మీరు దీని పురోగతిని డ్యాష్‌బోర్డ్‌లో చూడవచ్చు.",
      reportAnother: "మరో సమస్యను నమోదు చేయండి",
      viewInDashboard: "డ్యాష్‌బోర్డ్‌లో చూడండి"
    },
    dashboard: {
      heading: "పౌర పారిశుద్ధ్య డ్యాష్‌బోర్డ్",
      subtitle: "పరిసరాల పరిశుభ్రత చర్యల ప్రత్యక్ష పారదర్శక పర్యవేక్షణ.",
      statsTotal: "మొత్తం నివేదికలు",
      statsUnresolved: "పరిశీలనలో ఉన్నవి",
      statsInProgress: "పురోగతిలో ఉన్నవి",
      statsResolved: "పరిష్కరించబడినవి",
      filterSearch: "వెతకండి",
      filterSearchPlaceholder: "ఐడీ, ప్రదేశం లేదా శీర్షిక ద్వారా వెతకండి...",
      filterCategory: "వర్గం ద్వారా ఫిల్టర్",
      filterStatus: "స్థితి ద్వారా ఫిల్టర్",
      filterAll: "అన్ని వర్గాలు",
      sortBy: "క్రమబద్ధీకరణ",
      sortNewest: "తాజావి ముందుగా",
      sortOldest: "పాతవి ముందుగా",
      sortUrgency: "తీవ్రత ప్రకారం",
      noReportsFound: "ఏ నివేదికలూ కనుగొనబడలేదు.",
      noReportsSub: "అన్ని నివేదికలను చూడటానికి ఫిల్టర్లను తొలగించండి.",
      viewDetails: "వివరాలు & చరిత్ర చూడండి"
    },
    detail: {
      modalTitle: "పారిశుద్ధ్య నివేదిక వివరాలు",
      reportedOn: "నమోదు చేసిన తేదీ",
      location: "ప్రదేశం",
      status: "ప్రస్తుత స్థితి",
      timelineHeading: "చర్యల చరిత్ర మరియు కాలక్రమం",
      timelineSubtitle: "తీసుకున్న చర్యల పారదర్శక టైమ్‌స్టాంప్ వివరాలు.",
      verifiedBadge: "సమన్వయకర్త ధృవీకరించారు",
      unverifiedBadge: "సమర్పించబడింది (ధృవీకరణ కాలేదు)",
      coordinatorNoteBadge: "చర్య వివరణ",
      close: "మూసివేయి"
    },
    coordinator: {
      title: "సమన్వయకర్త పోర్టల్ (Coordinator Portal)",
      subtitle: "పరిసరాల పారిశుద్ధ్య నివేదికలను నిర్వహించండి, నిర్ధారించండి మరియు పరిష్కరించండి.",
      loginRequired: "సమన్వయకర్త అనుమతి",
      loginPrompt: "నిర్వాహక విభాగాన్ని యాక్సెస్ చేయడానికి కోఆర్డినేటర్ పాస్‌కోడ్ నమోదు చేయండి.",
      pinPlaceholder: "పాస్‌కోడ్ (డెమో: CLEAN2026)",
      loginButton: "లాగిన్ అవ్వండి",
      logoutButton: "నిష్క్రమించు",
      statusChangeHeading: "స్థితిని మార్చండి & చర్యను నమోదు చేయండి",
      selectNewStatus: "కొత్త స్థితిని ఎంచుకోండి",
      actionNotePrompt: "తీసుకున్న చర్య వివరాలు (బాధ్యతాయుతంగా వివరించండి)",
      actionNotePlaceholder: "ఉదాహరణ: వార్డు సానిటరీ ఇన్‌స్పెక్టర్‌కు సమాచారం ఇవ్వబడింది; పూడిక తీయబడింది.",
      proofPhotoPrompt: "పరిష్కార ఫోటో ఆధారం (ఐచ్ఛికం)",
      updateStatusBtn: "స్థితిని అప్‌డేట్ చేయండి",
      duplicateBtn: "డూప్లికేట్‌గా గుర్తించండి",
      flagBtn: "తప్పుదోవ పట్టించేదిగా గుర్తించండి",
      internalNotesHeading: "అంతర్గత గమనికలు (కోఆర్డినేటర్లకు మాత్రమే)",
      addNotePlaceholder: "అంతర్గత గమనికను నమోదు చేయండి...",
      addNoteBtn: "నోట్ సేవ్ చేయండి",
      exportCsvBtn: "రిపోర్టులను డౌన్‌లోడ్ చేయండి (CSV)",
      filterDuplicates: "డూప్లికేట్లను దాచండి",
      filterFlagged: "ఫ్లాగ్ చేసినవి మాత్రమే"
    },
    guidance: {
      heading: "పౌర అవగాహన మరియు పారిశుద్ధ్య మార్గదర్శకాలు",
      subtitle: "పరిసరాల పరిశుభ్రతను కాపాడే మార్గాలు మరియు అధికారిక ఫిర్యాదు పోర్టల్స్ వివరాలు.",
      disclaimerBox: "క్లీన్ స్ట్రీట్ అనేది సమాజ పరస్పర సహాయానికి ఉద్దేశించిన సాధనం. అత్యవసర ఆరోగ్య సమస్యల కోసం ఎల్లప్పుడూ అధికారిక మునిసిపల్ పోర్టల్స్‌ను ఉపయోగించండి.",
      officialChannelsTitle: "అధికారిక మునిసిపల్ ఫిర్యాదు వేదికలు",
      officialChannelsSub: "చట్టబద్ధమైన అధికారిక సేవల కోసం వీటిని సంప్రదించండి:",
      segregationTitle: "ఇంటి వద్దే చెత్త వేరుచేసే విధానం",
      segregationSub: "తడి, పొడి చెత్తను వేరుచేయడం వలన పారిశుద్ధ్య కార్మికులకు పని సులభమవుతుంది:"
    }
  }
};
