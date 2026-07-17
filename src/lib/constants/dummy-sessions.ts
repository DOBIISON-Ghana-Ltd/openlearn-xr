export interface DummySession {
  id: string;
  name: string | null;
  status: "STAGING" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  joinCode: string;
  createdAt: string;
  startedAt: string | null;
  endedAt: string | null;
  hostId: string;
  host: {
    name: string;
    image: "avatar-01" | "avatar-02" | "avatar-03" | "avatar-04" | "avatar-05" | "avatar-06" | "org-01"; // matches avatarKeys
  };
  moduleVersionId: string;
  moduleVersion: {
    id: string;
    versionNumber: number;
    module: {
      id: string;
      title: string;
      collection: {
        name: string;
      };
      overview: Record<string, any> | null;
    };
  };
}

export const dummySessions: DummySession[] = [
  {
    id: "dummy-lobby",
    name: "Physics Period 1 Staging",
    status: "STAGING",
    joinCode: "LOBBY7",
    createdAt: new Date().toISOString(),
    startedAt: null,
    endedAt: null,
    hostId: "teacher-john-id",
    host: {
      name: "Teacher John",
      image: "avatar-01"
    },
    moduleVersionId: "mv-phys-1",
    moduleVersion: {
      id: "mv-phys-1",
      versionNumber: 1,
      module: {
        id: "mod-phys-1",
        title: "Locating Images in a Plane Mirror",
        collection: {
          name: "Physics Book One"
        },
        overview: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Topic Overview" }]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "In this physics simulation, students will study the fundamentals of light reflection and image formation in plane mirrors. They will explore the law of reflection (angle of incidence equals angle of reflection) and verify that the object distance matches the image distance."
                }
              ]
            },
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Lab Practical Objectives" }]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "1. Position a virtual pin in front of a plane mirror.\n2. Trace multiple light rays from the pin to the viewer's eye.\n3. Find the virtual intersection point behind the mirror to locate the virtual image pin."
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    id: "dummy-active",
    name: "Chemistry Lab A Active",
    status: "ACTIVE",
    joinCode: "ACTIVE8",
    createdAt: new Date().toISOString(),
    startedAt: new Date(Date.now() - 600000).toISOString(),
    endedAt: null,
    hostId: "teacher-john-id",
    host: {
      name: "Teacher John",
      image: "avatar-01"
    },
    moduleVersionId: "mv-chem-2",
    moduleVersion: {
      id: "mv-chem-2",
      versionNumber: 2,
      module: {
        id: "mod-chem-2",
        title: "Acid-Base Titration",
        collection: {
          name: "Chemistry Book Two"
        },
        overview: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Topic Overview" }]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "This virtual lab covers volumetric analysis using acid-base titration. Students will determine the exact concentration of a hydrochloric acid (HCl) solution by reacting it with a standardized sodium hydroxide (NaOH) solution using phenolphthalein indicator."
                }
              ]
            },
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Lab Practical Objectives" }]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "1. Fill the virtual burette with NaOH solution and adjust to zero mark.\n2. Pipette 25mL of HCl into the conical flask and add indicator.\n3. Carefully perform the titration dropwise to observe the permanent light pink endpoint."
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    id: "dummy-completed",
    name: "Biology Unit 2 Review",
    status: "COMPLETED",
    joinCode: "DONE12",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    startedAt: new Date(Date.now() - 3600000).toISOString(),
    endedAt: new Date(Date.now() - 1800000).toISOString(),
    hostId: "teacher-john-id",
    host: {
      name: "Teacher John",
      image: "avatar-01"
    },
    moduleVersionId: "mv-bio-3",
    moduleVersion: {
      id: "mv-bio-3",
      versionNumber: 1,
      module: {
        id: "mod-bio-3",
        title: "Cell Division & Mitosis",
        collection: {
          name: "Biology Book One"
        },
        overview: {
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Topic Overview" }]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "Students will observe and identify the four primary stages of mitosis (Prophase, Metaphase, Anaphase, Telophase) using a virtual light microscope slide showing an onion root tip."
                }
              ]
            },
            {
              type: "heading",
              attrs: { level: 2 },
              content: [{ type: "text", text: "Lab Practical Objectives" }]
            },
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "1. Mount the onion root tip slide on the microscope stage.\n2. Adjust coarse and fine focus knobs to identify cells dividing.\n3. Categorize at least 10 cells into their correct mitotic stages."
                }
              ]
            }
          ]
        }
      }
    }
  },
  {
    id: "dummy-cancelled",
    name: "Cancelled Session Test",
    status: "CANCELLED",
    joinCode: "ABORT9",
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    startedAt: null,
    endedAt: null,
    hostId: "teacher-john-id",
    host: {
      name: "Teacher John",
      image: "avatar-01"
    },
    moduleVersionId: "mv-phys-1",
    moduleVersion: {
      id: "mv-phys-1",
      versionNumber: 1,
      module: {
        id: "mod-phys-1",
        title: "Locating Images in a Plane Mirror",
        collection: {
          name: "Physics Book One"
        },
        overview: null
      }
    }
  }
];
