import z from "zod";
import schema from "../src/data/api/new.admin/schema";

type IData = z.infer<typeof schema.SeedModules>;

export const data: IData = [
  {
    name: "Physics",
    slug: "physics",
    grade: "Year 1",
    description: "Senior High School Physics curriculum covering physical quantities, measurement techniques, electrostatics, circuit theory, mechanics, simple harmonic motion, energy, and optics.",
    modules: [
      {
        title: "Measurement of Physical Quantities",
        slug: "measurement-of-physical-quantities",
        image: "/module/measurement-of-physical-quantities/image.png",
        duration: "30 mins",
        difficulty: "MEDIUM",
        orderIndex: 1,
        description: "Learn how to accurately measure physical quantities, distinguish between fundamental and derived units, and identify different types of errors in measurement.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {},
            notes: {
              overview: {
                objectives: [
                  "Classify physical quantities into fundamental and derived quantities.",
                  "Determine the dimensions of various physical quantities.",
                  "Identify and properly use measuring instruments like the vernier caliper and micrometer screw gauge.",
                  "Explain systematic, random, and parallax errors in measurement."
                ]
              },
              engage: {
                curiosityQuestion: "Have you ever wondered how scientists accurately measure the exact thickness of a single strand of human hair?",
                preAssessment: [
                  {
                    question: "Which of the following is a fundamental physical quantity?",
                    options: [
                      "Speed",
                      "Mass",
                      "Force",
                      "I don't know"
                    ],
                    answer: 1
                  },
                  {
                    question: "Which instrument is most suitable for measuring the diameter of a thin wire?",
                    options: [
                      "Meter rule",
                      "Micrometer screw gauge",
                      "Vernier caliper",
                      "I don't know"
                    ],
                    answer: 1
                  },
                  {
                    question: "What type of error occurs when reading a scale from the wrong angle?",
                    options: [
                      "Systematic error",
                      "Random error",
                      "Parallax error",
                      "I don't know"
                    ],
                    answer: 2
                  },
                  {
                    question: "Which of the following is a vector quantity?",
                    options: [
                      "Distance",
                      "Speed",
                      "Velocity",
                      "I don't know"
                    ],
                    answer: 2
                  },
                  {
                    question: "What is the standard SI unit for measuring mass?",
                    options: [
                      "Gram",
                      "Kilogram",
                      "Pound",
                      "I don't know"
                    ],
                    answer: 1
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Vernier Caliper",
                    image: "/module/measurement-of-physical-quantities/explanation-01.png",
                    description: "A precision instrument used to measure internal and external diameters, as well as depths, with high accuracy."
                  },
                  {
                    name: "Micrometer Screw Gauge",
                    image: "/module/measurement-of-physical-quantities/explanation-02.png",
                    description: "An extremely precise tool ideal for measuring very small lengths or thicknesses, such as the diameter of a wire or thickness of paper."
                  },
                  {
                    name: "Electronic Balance",
                    image: "/module/measurement-of-physical-quantities/explanation-03.png",
                    description: "A modern digital scale that provides precise measurements of mass for various objects, eliminating human reading errors."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "Fundamental vs. Derived",
                    description: "Fundamental quantities (like mass and time) are independent, while derived quantities (like velocity and force) are combinations of fundamental ones."
                  },
                  {
                    phrase: "Types of Errors",
                    description: "Systematic errors are predictable (e.g., zero error), random errors are unpredictable fluctuations, and parallax is a viewing angle error."
                  },
                  {
                    phrase: "Scalars vs. Vectors",
                    description: "Scalar quantities have only magnitude (size), whereas vector quantities have both magnitude and a specific direction."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "Which of the following represents the dimension of velocity?",
                options: [
                  "LT⁻¹",
                  "LT⁻²",
                  "MLT⁻¹",
                  "L²T⁻¹"
                ],
                correctAnswer: 0,
                orderIndex: 1,
                points: 25,
                hint: "Velocity is defined as displacement divided by time.",
                explanation: "Displacement has the dimension of length (L) and time has the dimension of time (T). Therefore, velocity is L divided by T, which is written as LT⁻¹."
              },
              {
                question: "If an electronic balance consistently reads 0.5g when empty, what type of error does this represent?",
                options: [
                  "Random error",
                  "Systematic error",
                  "Parallax error",
                  "Human error"
                ],
                correctAnswer: 1,
                orderIndex: 2,
                points: 25,
                hint: "This error is consistent and shifts all measurements by the exact same predictable amount.",
                explanation: "Systematic errors are predictable and consistent, often caused by an uncalibrated instrument. A balance reading 0.5g when empty is a classic 'zero error', which is a type of systematic error."
              },
              {
                question: "Which list contains ONLY derived physical quantities?",
                options: [
                  "Mass, Length, Time",
                  "Velocity, Acceleration, Force",
                  "Temperature, Current, Luminous Intensity",
                  "Force, Mass, Volume"
                ],
                correctAnswer: 1,
                orderIndex: 3,
                points: 25,
                hint: "Derived quantities are formed by mathematically combining basic, fundamental quantities.",
                explanation: "Velocity, acceleration, and force are all calculated using fundamental quantities like length, mass, and time. Therefore, they are all derived quantities."
              },
              {
                question: "A student measures the length of a block multiple times. Which practice best reduces random errors?",
                options: [
                  "Using a more precise instrument",
                  "Taking multiple readings and calculating the average",
                  "Ensuring the eye is directly above the scale",
                  "Recalibrating the zero mark on the instrument"
                ],
                correctAnswer: 1,
                orderIndex: 4,
                points: 25,
                hint: "Random errors fluctuate unpredictably in both directions.",
                explanation: "Random errors are unpredictable statistical fluctuations in measurements. Taking multiple readings and calculating their average helps cancel out these high and low fluctuations, providing a much more reliable final result."
              },
              {
                question: "How does a vector quantity differ from a scalar quantity?",
                options: [
                  "Vectors have only magnitude.",
                  "Scalars have both magnitude and direction.",
                  "Vectors have both magnitude and direction, while scalars have only magnitude.",
                  "There is no difference; they are interchangeable in equations."
                ],
                correctAnswer: 2,
                orderIndex: 5,
                points: 25,
                hint: "Think about the difference between speed (scalar) and velocity (vector).",
                explanation: "Scalar quantities are fully described by a magnitude (size) alone, whereas vector quantities require both a magnitude and a specific direction to be completely defined in physics."
              }
            ]
          }
        ]
      },
      {
        title: "Detecting Charge with a Gold Leaf Electroscope",
        slug: "detecting-charge-with-a-gold-leaf-electroscope",
        image: "/module/detecting-charge-with-a-gold-leaf-electroscope/image.png",
        duration: "25 mins",
        difficulty: "EAZY",
        orderIndex: 2,
        description: "Discover how electrostatic forces work by exploring the structure and operation of a gold leaf electroscope to detect electric charges.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {},
            notes: {
              overview: {
                objectives: [
                  "Describe the basic structure of a gold leaf electroscope.",
                  "Explain how the electroscope detects the presence of an electric charge.",
                  "Distinguish between charging an electroscope by contact (conduction) and by induction."
                ]
              },
              engage: {
                curiosityQuestion: "We know that rubbing a balloon on our hair creates static electricity, but how can we actually 'see' or measure an invisible electric charge?",
                preAssessment: [
                  {
                    question: "What happens to the gold leaf when a positively charged rod is brought near a neutral electroscope?",
                    options: [
                      "It diverges",
                      "It collapses",
                      "Nothing happens",
                      "I don't know"
                    ],
                    answer: 0
                  },
                  {
                    question: "Which of the following materials is used for the stem of an electroscope to allow charge to flow?",
                    options: [
                      "Glass",
                      "Brass",
                      "Plastic",
                      "I don't know"
                    ],
                    answer: 1
                  },
                  {
                    question: "What is the primary fundamental rule of electrostatics?",
                    options: [
                      "Like charges attract",
                      "Like charges repel",
                      "Protons move through conductors",
                      "I don't know"
                    ],
                    answer: 1
                  },
                  {
                    question: "What type of charge is acquired by an object if it gains excess electrons?",
                    options: [
                      "Positive",
                      "Negative",
                      "Neutral",
                      "I don't know"
                    ],
                    answer: 1
                  },
                  {
                    question: "Transferring charge by directly touching a neutral object with a charged one is called:",
                    options: [
                      "Friction",
                      "Induction",
                      "Conduction",
                      "I don't know"
                    ],
                    answer: 2
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Metal Cap",
                    image: "/module/detecting-charge-with-a-gold-leaf-electroscope/explanation-01.png",
                    description: "A brass disc at the top of the electroscope where charged objects are brought near or touched."
                  },
                  {
                    name: "Brass Stem & Gold Leaf",
                    image: "/module/detecting-charge-with-a-gold-leaf-electroscope/explanation-02.png",
                    description: "A conductive brass rod that extends downwards, with a highly sensitive, extremely thin piece of gold foil attached to its lower end."
                  },
                  {
                    name: "Glass Casing",
                    image: "/module/detecting-charge-with-a-gold-leaf-electroscope/explanation-03.png",
                    description: "An insulating transparent enclosure that protects the delicate gold leaf from air drafts while allowing observation."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "Like Charges Repel",
                    description: "When charge spreads through the stem and the gold leaf, they acquire the same charge and push away from each other, causing divergence."
                  },
                  {
                    phrase: "Charging by Conduction",
                    description: "Touching a charged rod directly to the cap transfers electrons, leaving the electroscope with a permanent, identical charge."
                  },
                  {
                    phrase: "Charging by Induction",
                    description: "Hovering a charged rod near the cap repels or attracts electrons within the electroscope without direct transfer, temporarily causing divergence."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "If a negatively charged ebonite rod is touched directly to the brass cap of a neutral electroscope, what happens to the gold leaf?",
                options: [
                  "It diverges because it becomes positively charged.",
                  "It diverges because it becomes negatively charged.",
                  "It collapses entirely.",
                  "It remains completely stationary."
                ],
                correctAnswer: 1,
                orderIndex: 1,
                points: 25,
                hint: "Touching the cap transfers electrons from the rod into the electroscope.",
                explanation: "Through conduction, electrons flow from the negatively charged rod onto the metal cap, down the stem, and into the gold leaf. Since both the stem and the leaf become negatively charged, they repel each other, causing the leaf to diverge."
              },
              {
                question: "A positively charged glass rod is brought near the cap of a neutral electroscope but does not touch it. What is the charge on the gold leaf while the rod is held there?",
                options: [
                  "Positive",
                  "Negative",
                  "Neutral",
                  "Alternating"
                ],
                correctAnswer: 0,
                orderIndex: 2,
                points: 25,
                hint: "The positive rod attracts electrons to the top, leaving the bottom deficient in electrons.",
                explanation: "This is an example of electrostatic induction. The positive rod attracts free electrons up to the brass cap. As a result, the bottom portion (the stem and gold leaf) loses electrons, leaving it with a net positive charge. This causes the leaf to diverge."
              },
              {
                question: "Why is gold specifically chosen for the leaf in this instrument?",
                options: [
                  "Gold is highly positively charged by nature.",
                  "Gold is an insulator and traps electrons.",
                  "Gold can be hammered into extremely thin, lightweight foils.",
                  "Gold prevents the glass casing from cracking."
                ],
                correctAnswer: 2,
                orderIndex: 3,
                points: 25,
                hint: "The leaf needs to be as light as possible to react to very small repulsive forces.",
                explanation: "Gold is highly malleable and can be hammered into an incredibly thin foil. Because it is so lightweight and a good conductor, it responds very easily to the weak electrostatic repulsive forces, making the instrument highly sensitive."
              },
              {
                question: "An electroscope is already given a negative charge, and its leaf is diverged. When an unknown charged object is brought near the cap, the divergence of the leaf increases. What is the charge of the unknown object?",
                options: [
                  "Positive",
                  "Negative",
                  "Neutral",
                  "It cannot be determined from this observation."
                ],
                correctAnswer: 1,
                orderIndex: 4,
                points: 25,
                hint: "An increase in divergence means more negative charge is being pushed down into the leaf.",
                explanation: "If the unknown object is negative, it will repel even more electrons from the cap down into the already negative stem and leaf. This increases the repulsive force at the bottom, causing the leaf to diverge further."
              },
              {
                question: "What is the primary function of the glass casing surrounding the gold leaf?",
                options: [
                  "To insulate the electroscope from Earth's magnetic field.",
                  "To magnify the view of the gold leaf for the observer.",
                  "To act as a secondary conductor for the charge.",
                  "To protect the delicate leaf from moving due to air currents."
                ],
                correctAnswer: 3,
                orderIndex: 5,
                points: 25,
                hint: "Think about what might happen to a very thin, lightweight piece of foil if someone breathes on it.",
                explanation: "The gold leaf is extremely thin and light, making it highly susceptible to being blown around by drafts or air currents in the room. The glass casing isolates the leaf so that any movement observed is strictly due to electrostatic forces."
              }
            ]
          }
        ]
      },
      {
        title: "Series and Parallel Connections of Capacitors",
        slug: "series-and-parallel-connections-of-capacitors",
        image: "/module/series-and-parallel-connections-of-capacitors/image.png",
        duration: "30 mins",
        difficulty: "MEDIUM",
        orderIndex: 3,
        description: "Explore the relationships between potential difference, total charges, and effective capacitance when capacitors are arranged in series and parallel circuits.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {
              simulation: "A 3D virtual electronics breadboard featuring a DC power supply and two swappable capacitors. The user can use a toggle switch to immediately alter the circuit wiring between 'Series' and 'Parallel' configurations. A digital multimeter overlays the circuit, allowing the user to select whether it displays the Effective Capacitance, Total Charge, or Potential Difference.",
              controls: [
                {
                  label: "Circuit Configuration",
                  description: "Select how the two capacitors are wired together.",
                  type: "select",
                  options: ["Series", "Parallel"],
                  value: "Series",
                  defaultValue: "Series"
                },
                {
                  label: "Capacitor 1 Value (μF)",
                  description: "Adjust the capacitance rating of the first capacitor.",
                  type: "slider",
                  value: 2,
                  defaultValue: 2
                },
                {
                  label: "Capacitor 2 Value (μF)",
                  description: "Adjust the capacitance rating of the second capacitor.",
                  type: "slider",
                  value: 3,
                  defaultValue: 3
                },
                {
                  label: "Multimeter Readout Mode",
                  description: "Choose which circuit property the digital meter should display.",
                  type: "select",
                  options: ["Effective Capacitance", "Potential Difference", "Total Charge"],
                  value: "Effective Capacitance",
                  defaultValue: "Effective Capacitance"
                }
              ]
            },
            notes: {
              overview: {
                objectives: [
                  "Determine the effective capacitance of a number of capacitors arranged in series and parallel.",
                  "Explain series and parallel connections using a laboratory set or science kit.",
                  "Analyze the relationship with respect to potential difference, total charges, and capacitance in different circuit configurations."
                ]
              },
              engage: {
                curiosityQuestion: "If you need a specific amount of charge storage for an electronic device but only have standard capacitors, how can you combine them to get exactly what you need?",
                preAssessment: [
                  {
                    question: "In a series circuit, which physical quantity remains constant across all individual capacitors?",
                    options: ["Charge", "Voltage", "Capacitance", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "In a parallel circuit, which physical quantity remains identical across all connected capacitors?",
                    options: ["Charge", "Voltage", "Resistance", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "How do you calculate the total effective capacitance for multiple capacitors connected in parallel?",
                    options: ["Add their values directly", "Add their reciprocals", "Multiply their values", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "What generally happens to the total effective capacitance when you connect additional capacitors in series?",
                    options: ["It increases", "It decreases", "It stays exactly the same", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "What practical tool is typically used to safely and quickly construct these test circuits in a laboratory?",
                    options: ["Science kit / breadboard", "Oscilloscope", "Geiger counter", "I don't know"],
                    answer: 0
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Science Kit",
                    image: "/module/series-and-parallel-connections-of-capacitors/explanation-01.png",
                    description: "A practical laboratory set used to safely arrange and securely connect capacitors in different circuit configurations."
                  },
                  {
                    name: "Capacitor Component",
                    image: "/module/series-and-parallel-connections-of-capacitors/explanation-02.png",
                    description: "An electronic component that stores electrical charge, which can be wired end-to-end (series) or side-by-side (parallel)."
                  },
                  {
                    name: "DC Power Source",
                    image: "/module/series-and-parallel-connections-of-capacitors/explanation-03.png",
                    description: "Provides the electrical potential difference necessary to push and store total charges across the capacitor network."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "Series Connections",
                    description: "The overall effective capacitance decreases. The total charge is identical across all capacitors, while the potential difference is divided among them."
                  },
                  {
                    phrase: "Parallel Connections",
                    description: "The overall effective capacitance increases. The potential difference is identical across all capacitors, while the total charge is the sum of individual charges."
                  },
                  {
                    phrase: "Mathematical Relationships",
                    description: "For parallel circuits, effective capacitance is the direct sum. For series, the reciprocal of the effective capacitance is the sum of the individual reciprocals."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "Which circuit configuration results in an effective capacitance that is simply the direct sum of all individual capacitances?",
                options: ["Parallel connection", "Series connection", "Short circuit", "Open circuit"],
                correctAnswer: 0,
                orderIndex: 1,
                points: 25,
                hint: "Think of joining them side-by-side to effectively increase the overall plate area.",
                explanation: "In a parallel connection, the effective capacitance is determined by directly adding the individual capacitances together, increasing the total capacity."
              },
              {
                question: "What electrical property is identical across all capacitors when they are connected strictly in a series circuit?",
                options: ["Potential difference", "Total charge", "Effective capacitance", "Energy stored"],
                correctAnswer: 1,
                orderIndex: 2,
                points: 25,
                hint: "Think about the flow of electrons through a single, continuous path without any branches.",
                explanation: "For series connections, the total charge is identical on each individual capacitor because there is only one path for the electrons to flow, while the potential difference is divided."
              },
              {
                question: "If you connect a 2 μF capacitor and a 3 μF capacitor in parallel using a science kit, what is the resulting effective capacitance?",
                options: ["1.2 μF", "5 μF", "6 μF", "1 μF"],
                correctAnswer: 1,
                orderIndex: 3,
                points: 25,
                hint: "Use the direct addition rule for this specific configuration.",
                explanation: "For capacitors arranged in parallel, the total effective capacitance is calculated using C_total = C1 + C2. Therefore, 2 μF + 3 μF equals 5 μF."
              },
              {
                question: "According to the curriculum, what hands-on equipment should ideally be used to experientially explain series and parallel connections?",
                options: ["A laboratory set or science kit", "A Van de Graaff generator", "A ripple tank", "A gold leaf electroscope"],
                correctAnswer: 0,
                orderIndex: 4,
                points: 25,
                hint: "It is a standard package containing components used to quickly build and test circuits.",
                explanation: "The curriculum specifies using a laboratory set or science kit to experientially determine and explain the effective capacitance of series and parallel connections."
              },
              {
                question: "In a parallel circuit, how does the potential difference across each individual capacitor compare to the total source voltage?",
                options: ["It is exactly the same as the source", "It is divided equally among them", "It is inversely proportional to capacitance", "It is zero"],
                correctAnswer: 0,
                orderIndex: 5,
                points: 25,
                hint: "Each component has its own direct, unblocked path to the positive and negative terminals of the power source.",
                explanation: "In a parallel connection, the potential difference (voltage) across each individual capacitor is exactly the same as the total source voltage because each is connected directly to the source terminals."
              }
            ]
          }
        ]
      },
      {
        title: "Forces and Motion - Coefficient of Friction",
        slug: "forces-and-motion-coefficient-of-friction",
        image: "/module/forces-and-motion-coefficient-of-friction/image.png",
        duration: "30 mins",
        difficulty: "MEDIUM",
        orderIndex: 4,
        description: "Investigate the forces that oppose motion by performing practical experiments to determine the coefficient of friction.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {
              simulation: "A 3D interactive physics lab setup featuring a horizontal wooden board and a wooden block with a hook. A digital spring balance is connected to the hook to pull the block. The user can adjust the mass of the block to observe changes in the normal force. Additionally, the user can change the surface condition by selecting 'Dry Wood', 'Powdered', or 'Oiled' from a dropdown menu.",
              controls: [
                {
                  label: "Block Mass",
                  description: "Adjust the mass of the sliding wooden block.",
                  type: "slider",
                  value: 1,
                  defaultValue: 1
                },
                {
                  label: "Surface Condition",
                  description: "Select the treatment applied to the sliding surface.",
                  type: "select",
                  options: ["Dry Wood", "Powdered", "Oiled"],
                  value: "Dry Wood",
                  defaultValue: "Dry Wood"
                },
                {
                  label: "Initiate Pull",
                  description: "Start pulling the block to measure the frictional force.",
                  type: "toggle",
                  value: false,
                  defaultValue: false
                }
              ]
            },
            notes: {
              overview: {
                objectives: [
                  "Identify the effects, applications, and factors that affect friction.",
                  "Distinguish between static and dynamic friction.",
                  "Determine the coefficient of friction using wooden blocks and a spring balance."
                ]
              },
              engage: {
                curiosityQuestion: "Why does it take more force to start moving a heavy wooden block than it does to keep it sliding at a steady speed?",
                preAssessment: [
                  {
                    question: "What type of friction prevents a stationary object from moving?",
                    options: ["Static friction", "Dynamic friction", "Rolling friction", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "Which instrument is commonly used in the lab to measure the pulling force on a block?",
                    options: ["Spring balance", "Electronic balance", "Thermometer", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "How does adding a lubricant like oil or powder affect the friction between two surfaces?",
                    options: ["Increases it", "Decreases it", "Does not change it", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "What is dynamic friction?",
                    options: ["Friction acting on a moving object", "Friction acting on a stationary object", "Friction from fluids only", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "The coefficient of friction is the ratio of frictional force to which other force?",
                    options: ["Gravitational force", "Normal reaction", "Applied tension", "I don't know"],
                    answer: 1
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Spring Balance",
                    image: "/module/forces-and-motion-coefficient-of-friction/explanation-01.png",
                    description: "An instrument used to measure the pulling force required to move the wooden block across the plane."
                  },
                  {
                    name: "Wooden Block",
                    image: "/module/forces-and-motion-coefficient-of-friction/explanation-02.png",
                    description: "A mass with a hook attached, used to vary the normal reaction by stacking different masses on top."
                  },
                  {
                    name: "Horizontal Plane",
                    image: "/module/forces-and-motion-coefficient-of-friction/explanation-03.png",
                    description: "The surface (wooden, plastic, or metallic) on which the block slides. Can be modified with oil or powder to test different conditions."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "Static vs. Dynamic Friction",
                    description: "Static friction is the force to overcome before motion starts, while dynamic friction opposes objects already in steady motion."
                  },
                  {
                    phrase: "Coefficient of Friction",
                    description: "A numerical value representing the ratio of frictional force to the normal reaction force between two surfaces."
                  },
                  {
                    phrase: "Factors Affecting Friction",
                    description: "Friction depends on the nature of the surfaces in contact (e.g., using oil or grease) and the normal reaction, but not the surface area."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "In an experiment to determine the coefficient of friction, what happens to the normal reaction if you place an additional block of equal mass on top of the original block?",
                options: ["It is halved.", "It remains the same.", "It is doubled.", "It becomes zero."],
                correctAnswer: 2,
                orderIndex: 1,
                points: 25,
                hint: "Normal reaction is proportional to the total mass pressing down on the surface.",
                explanation: "Doubling the mass doubles the downward gravitational force, which in turn doubles the normal reaction force pressing the surfaces together."
              },
              {
                question: "Which of the following best describes the difference between static and dynamic friction?",
                options: [
                  "Static friction applies to stationary objects, while dynamic friction applies to sliding objects.",
                  "Dynamic friction is always greater than static friction.",
                  "Static friction only occurs on rough surfaces, and dynamic friction on smooth ones.",
                  "There is no measurable difference between them."
                ],
                correctAnswer: 0,
                orderIndex: 2,
                points: 25,
                hint: "Think about what the words 'static' (still) and 'dynamic' (moving) mean.",
                explanation: "Static friction must be overcome to start moving an object from rest, whereas dynamic friction acts on objects that are already in continuous motion."
              },
              {
                question: "According to the curriculum, what materials can be used to investigate how surface conditions affect the coefficient of friction?",
                options: ["Magnets and iron filings", "Powder, oil, or grease", "Different colored lights", "Acidic and basic solutions"],
                correctAnswer: 1,
                orderIndex: 3,
                points: 25,
                hint: "These substances are often used to reduce friction between moving parts.",
                explanation: "The physics curriculum specifies using powder, oil, or grease on wooden, plastic, or metallic boards to study the factors that affect friction."
              },
              {
                question: "What is the primary purpose of the spring balance in the friction experiment?",
                options: [
                  "To measure the mass of the wooden block.",
                  "To determine the ambient temperature.",
                  "To measure the applied force needed to overcome friction.",
                  "To calculate the volume of the block."
                ],
                correctAnswer: 2,
                orderIndex: 4,
                points: 25,
                hint: "A spring balance measures force in Newtons.",
                explanation: "A spring balance is attached to the wooden block to accurately measure the pulling force (tension) required to initiate and maintain the block's sliding motion."
              },
              {
                question: "If you pull a wooden block across a board at a steady, constant speed, the reading on the spring balance represents which force?",
                options: ["Static friction", "Dynamic friction", "Normal reaction", "Total mass"],
                correctAnswer: 1,
                orderIndex: 5,
                points: 25,
                hint: "The block is already moving steadily, not starting from rest.",
                explanation: "When an object moves at a constant speed, the applied pulling force perfectly balances the opposing dynamic frictional force."
              }
            ]
          }
        ]
      },
      {
        title: "Simple Harmonic Motion",
        slug: "simple-harmonic-motion",
        image: "/module/simple-harmonic-motion/image.png",
        duration: "30 mins",
        difficulty: "HARD",
        orderIndex: 5,
        description: "Explore the principles of simple harmonic motion and conduct a practical experiment to determine the acceleration due to gravity.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {
              simulation: "A 3D interactive physics laboratory featuring a simple pendulum attached to a retort stand. The user can adjust the length of the string via a slider. A digital stopwatch is mounted on the screen to track the time for 10 complete oscillations.",
              controls: [
                {
                  label: "Pendulum Length (m)",
                  description: "Adjust the length of the string from the pivot to the bob.",
                  type: "slider",
                  value: 0.5,
                  defaultValue: 0.5
                },
                {
                  label: "Release Pendulum",
                  description: "Toggle to release the pendulum and start the digital stopwatch.",
                  type: "toggle",
                  value: false,
                  defaultValue: false
                },
                {
                  label: "Reset Setup",
                  description: "Stop the pendulum and reset the stopwatch to 0.00s.",
                  type: "toggle",
                  value: false,
                  defaultValue: false
                }
              ]
            },
            notes: {
              overview: {
                objectives: [
                  "Use the concept of simple harmonic motion to determine acceleration due to gravity.",
                  "Measure the period of a simple pendulum at various lengths.",
                  "Communicate findings clearly and coherently."
                ]
              },
              engage: {
                curiosityQuestion: "If you take a grandfather clock to the Moon, will it tick faster, slower, or at the exact same rate as on Earth?",
                preAssessment: [
                  {
                    question: "What is the primary restoring force that brings a swinging simple pendulum back to its center position?",
                    options: ["Gravity", "Tension in the string", "Air resistance", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "The time taken for a pendulum to complete one full back-and-forth swing is called its:",
                    options: ["Frequency", "Period", "Amplitude", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "In simple harmonic motion, the acceleration of the object is directly proportional to its:",
                    options: ["Velocity", "Displacement from equilibrium", "Total mass", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "Which of the following factors does NOT affect the period of a simple pendulum?",
                    options: ["The length of the string", "The acceleration due to gravity", "The mass of the bob", "I don't know"],
                    answer: 2
                  },
                  {
                    question: "To graphically determine the acceleration due to gravity using a pendulum, you plot:",
                    options: ["Period vs Length", "Period squared vs Length", "Length squared vs Period", "I don't know"],
                    answer: 1
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Retort Stand and Pendulum Bob",
                    image: "/module/simple-harmonic-motion/explanation-01.png",
                    description: "The basic laboratory setup for a simple pendulum, allowing the spherical bob to swing freely in simple harmonic motion."
                  },
                  {
                    name: "Stopwatch",
                    image: "/module/simple-harmonic-motion/explanation-02.png",
                    description: "A timing device used to accurately measure the time taken for multiple oscillations to calculate the average period."
                  },
                  {
                    name: "Meter Rule",
                    image: "/module/simple-harmonic-motion/explanation-03.png",
                    description: "Used to measure the exact length of the pendulum string from the suspension point to the center of the bob."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "Simple Harmonic Motion (SHM)",
                    description: "A type of periodic motion where the restoring force is directly proportional to the displacement and acts in the direction opposite to that of displacement."
                  },
                  {
                    phrase: "Period of a Pendulum",
                    description: "The period depends only on the length of the pendulum and the acceleration due to gravity, defined by the formula T = 2π√(l/g)."
                  },
                  {
                    phrase: "Determining 'g'",
                    description: "By measuring the period (T) for various lengths (l) and graphing T² against l, the acceleration due to gravity (g) can be calculated from the slope."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "If the length of a simple pendulum is quadrupled, what happens to its period of oscillation?",
                options: ["It remains the same", "It doubles", "It quadruples", "It is halved"],
                correctAnswer: 1,
                orderIndex: 1,
                points: 25,
                hint: "The period is proportional to the square root of the length.",
                explanation: "Since T = 2π√(l/g), multiplying the length 'l' by 4 increases 'T' by a factor of √4, which equals 2. Therefore, the period doubles."
              },
              {
                question: "In an experiment to determine 'g', a student plots a graph of T² on the y-axis against l on the x-axis. What does the mathematical slope (gradient) of this graph represent?",
                options: ["g", "4π²/g", "g/4π²", "2π/g"],
                correctAnswer: 1,
                orderIndex: 2,
                points: 25,
                hint: "Rearrange the period formula to solve for T² as a function of l.",
                explanation: "Squaring the period formula gives T² = (4π²/g)l. This takes the form of a straight line equation y = mx, where the slope 'm' is 4π²/g."
              },
              {
                question: "Which of the following conditions is absolutely necessary for a simple pendulum to perfectly execute simple harmonic motion?",
                options: [
                  "The mass of the bob must be large.",
                  "The string must be highly elastic.",
                  "The initial angle of swing must be small.",
                  "There must be significant air resistance."
                ],
                correctAnswer: 2,
                orderIndex: 3,
                points: 25,
                hint: "The restoring force must be strictly proportional to displacement.",
                explanation: "For the restoring force to be mathematically proportional to the displacement, the angle of swing (amplitude) must be small (typically less than 10 degrees) so that sin(θ) ≈ θ."
              },
              {
                question: "What is the primary objective of studying simple harmonic motion in this specific curriculum module?",
                options: [
                  "To determine the mass of the earth",
                  "To determine acceleration due to gravity",
                  "To measure atmospheric air resistance",
                  "To calculate the volume of a sphere"
                ],
                correctAnswer: 1,
                orderIndex: 4,
                points: 25,
                hint: "Refer to the main curriculum goal for this kinematic topic.",
                explanation: "The physics curriculum explicitly states that the learning outcome is to 'Use the concept of simple harmonic motion to determine acceleration due to gravity.'"
              },
              {
                question: "Where is the acceleration of a pendulum bob at its maximum magnitude during simple harmonic motion?",
                options: [
                  "At the equilibrium (center) position",
                  "At the maximum displacement (amplitude)",
                  "Halfway between equilibrium and amplitude",
                  "It is constant everywhere"
                ],
                correctAnswer: 1,
                orderIndex: 5,
                points: 25,
                hint: "Acceleration is proportional to displacement from the center.",
                explanation: "In simple harmonic motion, acceleration is directly proportional to displacement. Therefore, it has its greatest magnitude at the maximum displacement (the highest points of the swing)."
              }
            ]
          }
        ]
      },
      {
        title: "Energy Forms and Changes",
        slug: "energy-forms-and-changes",
        image: "/module/energy-forms-and-changes/image.png",
        duration: "25 mins",
        difficulty: "EAZY",
        orderIndex: 6,
        description: "Explore the different forms of energy and how energy is conserved and transferred between objects in a system.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {
              simulation: "PhET Embed",
              embedLink: "https://phet.colorado.edu/sims/html/energy-forms-and-changes/latest/energy-forms-and-changes_all.html",
              controls: []
            },
            notes: {
              overview: {
                objectives: [
                  "Identify and describe various forms of energy (mechanical, electrical, thermal, light, chemical).",
                  "Explain the law of conservation of energy and how energy transforms from one form to another.",
                  "Observe and analyze energy transfer in simple mechanical and electrical systems."
                ]
              },
              engage: {
                curiosityQuestion: "When you ride a bicycle, your body burns calories (chemical energy) to move the pedals. Where does all that energy eventually go?",
                preAssessment: [
                  {
                    question: "Which of the following is considered a form of mechanical energy?",
                    options: ["Heat from a fire", "Motion of a turning wheel", "Electricity in a wire", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "What does a generator primarily do in an energy system?",
                    options: ["Creates energy from nothing", "Converts mechanical energy into electrical energy", "Stores chemical energy", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "The Law of Conservation of Energy states that:",
                    options: [
                      "Energy can be created but not destroyed",
                      "Energy cannot be created or destroyed, only transformed",
                      "Total energy in a system always decreases over time",
                      "I don't know"
                    ],
                    answer: 1
                  },
                  {
                    question: "When a light bulb is turned on, electrical energy is transformed primarily into:",
                    options: ["Light and thermal (heat) energy", "Chemical and mechanical energy", "Sound and light energy", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "Which type of energy is stored in the food we eat?",
                    options: ["Thermal energy", "Electrical energy", "Chemical energy", "I don't know"],
                    answer: 2
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Energy Source (Bicyclist)",
                    image: "/module/energy-forms-and-changes/explanation-01.png",
                    description: "Represents the input of chemical energy (from food) being converted into mechanical energy by pedaling."
                  },
                  {
                    name: "Generator",
                    image: "/module/energy-forms-and-changes/explanation-02.png",
                    description: "A device that takes the mechanical energy from the turning wheel and transforms it into electrical energy."
                  },
                  {
                    name: "Energy Output (Fan/Bulb)",
                    image: "/module/energy-forms-and-changes/explanation-03.png",
                    description: "Receives the electrical energy and converts it into the final useful form, such as mechanical motion (fan) or light (bulb)."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "Energy Transformation",
                    description: "Energy constantly changes forms. For example, chemical energy in muscles becomes mechanical energy to pedal a bike."
                  },
                  {
                    phrase: "Conservation of Energy",
                    description: "In any closed system, the total amount of energy remains constant; it just shifts from one form (like mechanical) to another (like electrical)."
                  },
                  {
                    phrase: "Energy Symbols",
                    description: "Simulations use symbols to track energy types: Mechanical (grey), Electrical (blue), Thermal (red), Light (yellow), and Chemical (green)."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "In the bicycle-generator-fan system, what is the initial source of energy?",
                options: [
                  "Mechanical energy from the spinning wheel",
                  "Electrical energy from the generator",
                  "Chemical energy from the bicyclist",
                  "Thermal energy from the belt"
                ],
                correctAnswer: 2,
                orderIndex: 1,
                points: 25,
                hint: "Think about what is powering the motion of the pedals in the first place.",
                explanation: "The bicyclist uses chemical energy stored in their body (from food) to pedal the bicycle, starting the chain of energy transfers."
              },
              {
                question: "As the bicyclist pedals and turns the generator, what energy transformation occurs inside the generator?",
                options: [
                  "Chemical energy to Light energy",
                  "Mechanical energy to Electrical energy",
                  "Electrical energy to Thermal energy",
                  "Thermal energy to Mechanical energy"
                ],
                correctAnswer: 1,
                orderIndex: 2,
                points: 25,
                hint: "The generator takes the spinning motion and turns it into current flowing through the wire.",
                explanation: "A generator works by converting the kinetic (mechanical) energy of the spinning wheel into electrical energy that flows out through the wires."
              },
              {
                question: "What happens to some of the energy during these transformations, which explains why the bicyclist eventually gets tired and sweats?",
                options: [
                  "It is destroyed completely.",
                  "It turns into chemical energy in the generator.",
                  "It is lost as thermal (heat) energy to the surroundings.",
                  "It turns into pure light energy."
                ],
                correctAnswer: 2,
                orderIndex: 3,
                points: 25,
                hint: "No machine is 100% efficient; some energy always escapes in a form you can feel as warmth.",
                explanation: "Due to friction and inefficiencies in the human body and the mechanical parts, some chemical and mechanical energy is converted into thermal (heat) energy, which dissipates into the environment."
              },
              {
                question: "If you replace the fan with a light bulb in the system, what is the final primary energy output?",
                options: ["Chemical energy", "Mechanical energy", "Light energy", "Sound energy"],
                correctAnswer: 2,
                orderIndex: 4,
                points: 25,
                hint: "Think about the purpose of a light bulb.",
                explanation: "A light bulb is designed to take electrical energy and transform it primarily into light energy (along with some thermal energy)."
              },
              {
                question: "Which of the following best summarizes the Law of Conservation of Energy demonstrated in the system?",
                options: [
                  "The generator creates more energy than the bicyclist puts in.",
                  "The total amount of energy tracked (chemical, mechanical, electrical, thermal) remains constant throughout the transfers.",
                  "Energy is destroyed when it turns into heat.",
                  "The fan uses up the energy so it no longer exists."
                ],
                correctAnswer: 1,
                orderIndex: 5,
                points: 25,
                hint: "Energy simply changes 'costumes' but the total 'count' stays the same.",
                explanation: "The Law of Conservation of Energy states that energy cannot be created or destroyed. In the simulation, you can track the exact 'chunks' of energy as they change forms from chemical, to mechanical, to electrical, to light or heat, but the total amount is conserved."
              }
            ]
          }
        ]
      },
      {
        title: "Geometric Optics",
        slug: "geometric-optics",
        image: "/module/geometric-optics/image.png",
        duration: "30 mins",
        difficulty: "MEDIUM",
        orderIndex: 7,
        description: "Explore the processes involved in image formation using spherical mirrors and lenses, and understand the characteristics of these images through ray tracing.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {
              simulation: "PhET Embed",
              embedLink: "https://phet.colorado.edu/sims/html/geometric-optics/latest/geometric-optics_all.html",
              controls: []
            },
            notes: {
              overview: {
                objectives: [
                  "Describe the processes involved in image formation in spherical mirrors and their characteristics using ray tracing.",
                  "Determine the position and characteristics of images formed by spherical mirrors.",
                  "Distinguish between images formed by converging and diverging mirrors."
                ]
              },
              engage: {
                curiosityQuestion: "Have you ever wondered why your reflection looks upside down in a spoon but upright in a makeup mirror?",
                preAssessment: [
                  {
                    question: "What type of image cannot be projected onto a physical screen?",
                    options: ["Virtual image", "Real image", "Magnified image", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "The point where parallel rays of light converge after reflecting off a concave mirror is called the:",
                    options: ["Center of curvature", "Pole", "Principal focus", "I don't know"],
                    answer: 2
                  },
                  {
                    question: "A mirror that curves inward, like the inside of a bowl, is known as a:",
                    options: ["Convex mirror", "Concave mirror", "Plane mirror", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "Which ray passes through the principal focus after reflecting from a concave mirror?",
                    options: [
                      "A ray parallel to the principal axis",
                      "A ray passing through the center of curvature",
                      "A ray striking the pole",
                      "I don't know"
                    ],
                    answer: 0
                  },
                  {
                    question: "What is the mathematical relationship between the radius of curvature and the focal length of a spherical mirror?",
                    options: ["Radius is half the focal length", "Radius is twice the focal length", "They are exactly equal", "I don't know"],
                    answer: 1
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Spherical Mirror/Lens",
                    image: "/module/geometric-optics/explanation-01.png",
                    description: "Optical devices that reflect or refract light rays to form real or virtual images depending on their curvature."
                  },
                  {
                    name: "Object (Pencil)",
                    image: "/module/geometric-optics/explanation-02.png",
                    description: "The source of light rays that are traced to determine the size, orientation, and position of the resulting image."
                  },
                  {
                    name: "Ray Tracing",
                    image: "/module/geometric-optics/explanation-03.png",
                    description: "Lines showing the path of light, including principal and marginal rays, used to visually predict image formation."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "Image Characteristics",
                    description: "Images formed by spherical mirrors can be real (inverted and projectable) or virtual (upright and non-projectable)."
                  },
                  {
                    phrase: "Principal Focus",
                    description: "The specific point on the principal axis where rays parallel to the axis converge after reflection or refraction."
                  },
                  {
                    phrase: "Magnification",
                    description: "Determines how much larger or smaller the image is compared to the original object, calculated using the mirror and magnification formulas."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "When an object is placed exactly at the center of curvature of a concave mirror, what are the characteristics of the image formed?",
                options: [
                  "Real, inverted, and same size",
                  "Virtual, upright, and magnified",
                  "Real, inverted, and diminished",
                  "Virtual, inverted, and same size"
                ],
                correctAnswer: 0,
                orderIndex: 1,
                points: 25,
                hint: "Think about ray tracing when the object is at point C.",
                explanation: "Ray tracing shows that an object at the center of curvature of a concave mirror forms an image at the exact same position, which is real, inverted, and the same size as the object."
              },
              {
                question: "What type of image is always formed by a convex (diverging) mirror regardless of the object's distance from the mirror?",
                options: [
                  "Real, inverted, and magnified",
                  "Virtual, upright, and diminished",
                  "Real, upright, and diminished",
                  "Virtual, inverted, and magnified"
                ],
                correctAnswer: 1,
                orderIndex: 2,
                points: 25,
                hint: "Think about the passenger-side mirror on a car.",
                explanation: "A convex mirror always diverges light rays, meaning they only appear to intersect behind the mirror, forming a virtual, upright, and diminished image."
              },
              {
                question: "Which principal ray is typically used as a standard rule to locate an image in a spherical mirror?",
                options: [
                  "A ray parallel to the principal axis that reflects through the focal point.",
                  "A ray that reflects parallel to the mirror surface.",
                  "A ray that bends away from the normal.",
                  "A ray that stops at the pole."
                ],
                correctAnswer: 0,
                orderIndex: 3,
                points: 25,
                hint: "It's one of the primary rules for drawing ray diagrams.",
                explanation: "A standard principal ray used in ray tracing travels parallel to the principal axis and reflects through the principal focus (or appears to originate from it in a convex mirror)."
              },
              {
                question: "If the focal length of a concave mirror is 15 cm, what is its radius of curvature?",
                options: ["7.5 cm", "15 cm", "30 cm", "45 cm"],
                correctAnswer: 2,
                orderIndex: 4,
                points: 25,
                hint: "The radius of curvature is twice the focal length.",
                explanation: "The radius of curvature is geometrically twice the distance of the focal length from the pole of the mirror (R = 2f). Therefore, 2 x 15 cm = 30 cm."
              },
              {
                question: "In the context of geometric optics, what does a \"virtual\" image mean?",
                options: [
                  "It can be projected onto a screen.",
                  "It is formed by actual intersection of light rays.",
                  "It cannot be projected onto a screen.",
                  "It is always magnified."
                ],
                correctAnswer: 2,
                orderIndex: 5,
                points: 25,
                hint: "Think about the image in your bathroom mirror.",
                explanation: "A virtual image is formed by the apparent intersection of light rays diverging from the mirror. Because light does not actually pass through the image location, it cannot be captured on a physical screen."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    name: "Chemistry",
    slug: "chemistry",
    grade: "Year 1",
    description: "Senior High School Chemistry curriculum covering atomic structure, chemical bonding, and thermochemistry.",
    modules: [
      {
        title: "Model Dalton's Atom and Orbitals",
        slug: "model-daltons-atom-and-orbitals",
        image: "/module/model-daltons-atom-and-orbitals/image.png",
        duration: "30 mins",
        difficulty: "MEDIUM",
        orderIndex: 1,
        description: "Explore the evolution of atomic theory from Dalton's simple sphere to modern quantum numbers, and model the 3D shapes of s and p-orbitals.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {
              simulation: "An interactive 3D virtual laboratory where the user can build and inspect different historical atomic models and electron orbitals. The central workbench features a stand where the user can select an atomic model to display (Dalton's Sphere, Thompson's Plum Pudding, or Rutherford's Nucleus). A secondary holographic display allows the user to select and view the 3D shapes of specific atomic orbitals.",
              controls: [
                {
                  label: "Select Atomic Model",
                  description: "Choose a historical atomic model to display on the workbench.",
                  type: "select",
                  options: ["Dalton's Sphere", "Thompson's Model", "Rutherford's Model"],
                  value: "Dalton's Sphere",
                  defaultValue: "Dalton's Sphere"
                },
                {
                  label: "Select Orbital View",
                  description: "Visualize the 3D shape of a specific atomic orbital.",
                  type: "select",
                  options: ["1s Orbital", "2s Orbital", "2px Orbital", "2py Orbital", "2pz Orbital"],
                  value: "1s Orbital",
                  defaultValue: "1s Orbital"
                },
                {
                  label: "Toggle Quantum Labels",
                  description: "Show or hide the principal and azimuthal quantum numbers for the selected orbital.",
                  type: "toggle",
                  value: false,
                  defaultValue: false
                }
              ]
            },
            notes: {
              overview: {
                objectives: [
                  "Identify the main postulates of Dalton's atomic theory and explain its weaknesses.",
                  "Describe J. J. Thompson's and Rutherford's experiments and identify the weaknesses in their atomic models.",
                  "Model the shapes of s and p-orbitals and explain the importance of quantum numbers."
                ]
              },
              engage: {
                curiosityQuestion: "If atoms are mostly empty space, why does a solid table feel completely solid when you hit it?",
                preAssessment: [
                  {
                    question: "Dalton's original atomic theory described the atom as what kind of structure?",
                    options: [
                      "A simple sphere with no internal structure",
                      "A nucleus surrounded by electrons",
                      "A sea of positive charge with negative electrons",
                      "I don't know"
                    ],
                    answer: 0
                  },
                  {
                    question: "What 3D shape describes an atomic p-orbital?",
                    options: ["Spherical", "Dumbbell-shaped", "Clover-shaped", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "Which historic experiment led to the discovery of the dense, positively charged atomic nucleus?",
                    options: [
                      "Rutherford's alpha scattering experiment",
                      "Thompson's cathode ray experiment",
                      "Bohr's hydrogen spectrum experiment",
                      "I don't know"
                    ],
                    answer: 0
                  },
                  {
                    question: "In quantum mechanics, what does the principal quantum number (n) primarily determine?",
                    options: [
                      "The energy level or electron shell",
                      "The 3D shape of the orbital",
                      "The spin of the electron",
                      "I don't know"
                    ],
                    answer: 0
                  },
                  {
                    question: "How many individual p-orbitals exist within a single p-subshell?",
                    options: ["1", "3", "5", "I don't know"],
                    answer: 1
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Dalton's Atom Model",
                    image: "/module/model-daltons-atom-and-orbitals/explanation-01.png",
                    description: "Constructed as a simple sphere with no internal structure, representing indivisible matter as initially proposed by Dalton."
                  },
                  {
                    name: "s-orbital",
                    image: "/module/model-daltons-atom-and-orbitals/explanation-02.png",
                    description: "A spherical region around the nucleus modelled using a single balloon, representing where an s-electron is likely found."
                  },
                  {
                    name: "p-orbital",
                    image: "/module/model-daltons-atom-and-orbitals/explanation-03.png",
                    description: "A dumbbell-shaped orbital aligned along an axis, modelled practically using two balloons joined at their knots."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "Atomic Theory Evolution",
                    description: "Discoveries of subatomic particles via cathode ray and alpha scattering experiments revealed weaknesses in Dalton's and Thompson's early models."
                  },
                  {
                    phrase: "Quantum Numbers",
                    description: "The principal, angular momentum (azimuthal), magnetic, and spin quantum numbers describe the complex electron structure of the atom."
                  },
                  {
                    phrase: "Aufbau Principle",
                    description: "Electrons fill atomic orbitals of the lowest available energy levels before occupying higher levels."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "According to Dalton's atomic theory, which of the following best describes the structure of an atom?",
                options: [
                  "It contains a dense, positive nucleus.",
                  "It is a simple sphere with no internal structure.",
                  "It is composed of a sea of positive charge with electrons embedded.",
                  "It has electrons orbiting in fixed, quantized energy levels."
                ],
                correctAnswer: 1,
                orderIndex: 1,
                points: 25,
                hint: "Think about the earliest model of the atom before subatomic particles were discovered.",
                explanation: "Dalton's atomic theory originally modeled the atom simply as an indivisible sphere with no internal structure, as electrons and protons had not yet been discovered."
              },
              {
                question: "What was the primary conclusion drawn from Rutherford's alpha particles scattering experiment?",
                options: [
                  "Electrons exist only in quantized energy levels.",
                  "Atoms are solid and entirely indivisible.",
                  "The atom consists of a tiny, dense, positively charged nucleus.",
                  "Cathode rays are made of negatively charged particles."
                ],
                correctAnswer: 2,
                orderIndex: 2,
                points: 25,
                hint: "Consider what happened to the few alpha particles that bounced straight back from the gold foil.",
                explanation: "Rutherford's alpha particle scattering experiment provided evidence that the atom is mostly empty space with a dense, positively charged nucleus at the center, highlighting critical weaknesses in Thompson's model."
              },
              {
                question: "Which specific quantum number describes the 3D shape of an atomic orbital (such as s or p)?",
                options: [
                  "Principal quantum number",
                  "Angular momentum (Azimuthal) quantum number",
                  "Magnetic quantum number",
                  "Spin quantum number"
                ],
                correctAnswer: 1,
                orderIndex: 3,
                points: 25,
                hint: "This quantum number is often represented by the letter 'l'.",
                explanation: "The angular momentum or azimuthal quantum number dictates the shape of the electron orbital, distinguishing between the spherical s-orbitals and dumbbell-shaped p-orbitals."
              },
              {
                question: "When physically modelling atomic orbitals in the lab, how many inflated balloons (joined at their knots) are typically used to represent a single p-orbital?",
                options: ["One", "Two", "Three", "Four"],
                correctAnswer: 1,
                orderIndex: 4,
                points: 25,
                hint: "Think of the characteristic dumbbell shape of this specific orbital.",
                explanation: "A single p-orbital has a two-lobed, dumbbell shape and is effectively modelled using two inflated balloons joined at their knots."
              },
              {
                question: "Which principle or rule dictates the specific order in which atomic orbitals are filled with electrons?",
                options: [
                  "Dalton's Law of Multiple Proportions",
                  "Bohr's Planetary Theory",
                  "Aufbau principle",
                  "Rutherford's Principle"
                ],
                correctAnswer: 2,
                orderIndex: 5,
                points: 25,
                hint: "This term comes from a German word meaning 'building up'.",
                explanation: "The Aufbau principle, along with Pauli's exclusion principle and Hund's rule of maximum multiplicity, is applied to write the correct electron configuration and determine the order in which orbitals are filled."
              }
            ]
          }
        ]
      },
      {
        title: "Chemical Bonding",
        slug: "chemical-bonding",
        image: "/module/chemical-bonding/image.png",
        duration: "30 mins",
        difficulty: "HARD",
        orderIndex: 2,
        description: "Explore the role of modelling, evidence, and theory in explaining the structure, bonding, and properties of molecular compounds.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {
              simulation: "An interactive 3D molecular modeling workbench. The user can select from a dropdown list of target molecules (BeCl2, BCl3, CH4, PCl5, SF6). Upon selection, the 3D model snaps into the correct geometry determined by VSEPR theory.",
              controls: [
                {
                  label: "Select Molecule",
                  description: "Choose a molecule to visualize its 3D geometry and hybridization.",
                  type: "select",
                  options: [
                    "BeCl2 (Linear)",
                    "BCl3 (Trigonal Planar)",
                    "CH4 (Tetrahedral)",
                    "PCl5 (Trigonal Bipyramidal)",
                    "SF6 (Octahedral)"
                  ],
                  value: "CH4 (Tetrahedral)",
                  defaultValue: "CH4 (Tetrahedral)"
                },
                {
                  label: "Show Hybrid Orbitals",
                  description: "Toggle to display the hybrid orbital lobes around the central atom.",
                  type: "toggle",
                  value: false,
                  defaultValue: false
                },
                {
                  label: "Display Bond Angles",
                  description: "Toggle to show the exact bond angle measurements on the 3D model.",
                  type: "toggle",
                  value: true,
                  defaultValue: true
                }
              ]
            },
            notes: {
              overview: {
                objectives: [
                  "Predict the shape and bond angles for species using the VSEPR theory.",
                  "Distinguish between sigma and pi bonds and describe their formation.",
                  "Explain hybridization and use molecular models to identify various types of hybrid orbitals."
                ]
              },
              engage: {
                curiosityQuestion: "How do invisible atoms decide what 3D shapes to form when they bond together to build everything in the universe?",
                preAssessment: [
                  {
                    question: "What theory predicts the 3D shape of a molecule based on the repulsion between electron pairs?",
                    options: ["Atomic Orbital Theory", "VSEPR Theory", "Kinetic Molecular Theory", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "Which type of bond is formed by the direct, co-axial overlap of atomic orbitals?",
                    options: ["Pi bond", "Sigma bond", "Ionic bond", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "What is the hybridization of the central carbon atom in a methane (CH4) molecule?",
                    options: ["sp", "sp2", "sp3", "I don't know"],
                    answer: 2
                  },
                  {
                    question: "What is the bond angle in a perfectly tetrahedral molecule like methane?",
                    options: ["90 degrees", "109.5 degrees", "120 degrees", "I don't know"],
                    answer: 1
                  },
                  {
                    question: "Which of the following describes the mixing of atomic orbitals of different energy to obtain new equivalent orbitals?",
                    options: ["Hybridization", "Resonance", "Polarization", "I don't know"],
                    answer: 0
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Molecular Models",
                    image: "/module/chemical-bonding/explanation-01.png",
                    description: "Physical representations used to identify and explain various types of hybridization and molecular shapes."
                  },
                  {
                    name: "Sigma (σ) Bond",
                    image: "/module/chemical-bonding/explanation-02.png",
                    description: "A strong covalent bond formed by the direct, co-axial overlap of atomic orbitals."
                  },
                  {
                    name: "Pi (π) Bond",
                    image: "/module/chemical-bonding/explanation-03.png",
                    description: "A covalent bond formed by the lateral or sideway overlap of atomic orbitals."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "VSEPR Theory",
                    description: "Valence Shell Electron Pair Repulsion theory states that electron pairs around a central atom repel each other, dictating the 3D shape of the molecule."
                  },
                  {
                    phrase: "Hybridization",
                    description: "The mixing of atomic orbitals of different energy and shape to obtain a set of new hybrid orbitals (e.g., sp, sp2, sp3, sp3d) of equivalent energy."
                  },
                  {
                    phrase: "Giant Covalent Structures",
                    description: "Substances like diamond, graphite, and silicon (IV) oxide form large network structures with distinct bonding patterns and physical properties."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "Using VSEPR theory, what is the predicted shape of a molecule with a central atom surrounded by exactly 3 bonding pairs and no lone pairs, such as BCl3?",
                options: ["Linear", "Trigonal planar", "Tetrahedral", "Octahedral"],
                correctAnswer: 1,
                orderIndex: 1,
                points: 25,
                hint: "The three electron pairs will repel each other equally in a 2D plane.",
                explanation: "According to VSEPR theory, 3 negative charge centres around a central atom will position themselves as far apart as possible, resulting in a trigonal planar shape with 120-degree bond angles."
              },
              {
                question: "Which type of hybridization is associated with a linear molecular geometry, such as in BeCl2?",
                options: ["sp", "sp2", "sp3", "dsp2"],
                correctAnswer: 0,
                orderIndex: 2,
                points: 25,
                hint: "It involves the mixing of one s orbital and one p orbital.",
                explanation: "Linear molecules like BeCl2 exhibit sp hybridization, where the two sp hybrid orbitals are oriented 180 degrees apart to minimize repulsion."
              },
              {
                question: "What is the primary difference in orbital overlap between a sigma bond and a pi bond?",
                options: [
                  "Sigma bonds overlap laterally, while pi bonds overlap head-on.",
                  "Both overlap laterally but have different energies.",
                  "Sigma bonds form from co-axial (head-on) overlap, while pi bonds form from lateral (sideway) overlap.",
                  "Sigma bonds only form between s orbitals, while pi bonds only form between p orbitals."
                ],
                correctAnswer: 2,
                orderIndex: 3,
                points: 25,
                hint: "Think about the geometric orientation of the overlapping lobes.",
                explanation: "Sigma bonds are formed by the linear, co-axial overlap of atomic orbitals, providing a strong bond. Pi bonds are formed by the lateral or sideway overlap of parallel p-orbitals."
              },
              {
                question: "When atomic orbitals mix to form sp3d2 hybridization, what molecular shape is predicted for the resulting molecule (e.g., SF6)?",
                options: ["Tetrahedral", "Trigonal bipyramidal", "Octahedral", "Square planar"],
                correctAnswer: 2,
                orderIndex: 4,
                points: 25,
                hint: "It involves a total of 6 hybrid orbitals.",
                explanation: "The mixing of one s, three p, and two d orbitals yields six sp3d2 hybrid orbitals, which orient themselves in an octahedral geometry to minimize repulsion."
              },
              {
                question: "Based on their structure and bonding, how does the molecular model of diamond compare to graphite?",
                options: [
                  "Diamond has sp2 hybridized carbon atoms in layers, while graphite has sp3 hybridized carbon atoms in a 3D network.",
                  "Both consist of identical sp3 hybridized discrete molecules.",
                  "Diamond forms a 3D tetrahedral network with sp3 carbons, while graphite forms flat sheets of sp2 carbons with delocalized pi electrons.",
                  "Diamond contains strong pi bonds, while graphite only contains weak sigma bonds."
                ],
                correctAnswer: 2,
                orderIndex: 5,
                points: 25,
                hint: "Consider why graphite can conduct electricity but diamond cannot.",
                explanation: "Diamond's structure consists of sp3 hybridized carbon atoms bonded in a rigid tetrahedral 3D network. Graphite consists of layers of sp2 hybridized carbons with delocalized pi electrons between the layers."
              }
            ]
          }
        ]
      },
      {
        title: "Determine Enthalpy Changes",
        slug: "determine-enthalpy-changes",
        image: "/module/determine-enthalpy-changes/image.png",
        duration: "30 mins",
        difficulty: "HARD",
        orderIndex: 3,
        description: "Investigate the energy changes that occur during chemical reactions by determining standard enthalpy changes using calorimetry.",
        versions: [
          {
            versionNumber: 1,
            status: "PUBLISHED",
            changeNote: "Initial published version.",
            interactiveConfig: {
              simulation: "An interactive 3D calorimetry setup featuring an insulated calorimeter cup, a digital thermometer, and a stirring rod on a lab bench.",
              controls: [
                {
                  label: "Select Reaction Type",
                  description: "Choose the type of enthalpy reaction to investigate in the calorimeter.",
                  type: "select",
                  options: [
                    "Neutralization (HCl + NaOH)",
                    "Solution (NH4Cl in Water)",
                    "Solution (CaCl2 in Water)"
                  ],
                  value: "Neutralization (HCl + NaOH)",
                  defaultValue: "Neutralization (HCl + NaOH)"
                },
                {
                  label: "Reactant Mass / Volume",
                  description: "Adjust the mass or volume of the reactants added to the calorimeter.",
                  type: "slider",
                  value: 50,
                  defaultValue: 50
                },
                {
                  label: "Initiate Reaction",
                  description: "Toggle to mix the reactants and monitor the temperature change.",
                  type: "toggle",
                  value: false,
                  defaultValue: false
                }
              ]
            },
            notes: {
              overview: {
                objectives: [
                  "Explain standard enthalpy changes such as combustion, neutralization, and solution.",
                  "Perform calorimetry experiments to determine the calorific value of common foods and fuels.",
                  "Calculate enthalpy changes using the relationship ΔH = mcΔT and interpret the results."
                ]
              },
              engage: {
                curiosityQuestion: "Why do some chemical reactions make their surroundings freezing cold, while others release enough heat to cook food or power engines?",
                preAssessment: [
                  {
                    question: "What term describes a chemical reaction that releases heat to its surroundings?",
                    options: ["Exothermic", "Endothermic", "Isothermic", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "Which instrument is primarily used in the laboratory to measure heat changes during a reaction?",
                    options: ["Calorimeter", "Barometer", "Spectrometer", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "What is the mathematical relationship used to calculate heat change from a temperature change?",
                    options: ["q = mcΔT", "P = F/A", "V = IR", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "Enthalpy of neutralization specifically involves the reaction between which two types of substances?",
                    options: ["An acid and a base", "Two metals", "Two noble gases", "I don't know"],
                    answer: 0
                  },
                  {
                    question: "Which law states that the total enthalpy change for a reaction is independent of the pathway taken?",
                    options: ["Hess's Law", "Boyle's Law", "Charles's Law", "I don't know"],
                    answer: 0
                  }
                ]
              },
              explanation: {
                items: [
                  {
                    name: "Calorimetry Setup",
                    image: "/module/determine-enthalpy-changes/explanation-01.png",
                    description: "An insulated container used to measure the temperature change of a liquid during a chemical reaction, minimizing heat loss to the surroundings."
                  },
                  {
                    name: "Digital Thermometer",
                    image: "/module/determine-enthalpy-changes/explanation-02.png",
                    description: "Used to accurately measure the initial and final temperatures (ΔT) of the reacting system to determine energy changes."
                  },
                  {
                    name: "Chemical Reagents",
                    image: "/module/determine-enthalpy-changes/explanation-03.png",
                    description: "Reactants such as HCl and NaOH for neutralization, or NH4Cl for heat of solution, used to study specific enthalpy changes."
                  }
                ],
                keyTakeaways: [
                  {
                    phrase: "Exothermic vs Endothermic",
                    description: "Exothermic reactions release heat causing a temperature rise, while endothermic reactions absorb heat causing a temperature drop."
                  },
                  {
                    phrase: "Calculating Enthalpy Change",
                    description: "Heat transfer is calculated using ΔH = mcΔT, where 'm' is mass, 'c' is specific heat capacity, and 'ΔT' is the temperature change."
                  },
                  {
                    phrase: "Hess's Law",
                    description: "The total enthalpy change of a reaction is constant and can be found using energy cycles, regardless of the route taken."
                  }
                ]
              }
            },
            checkpoints: [
              {
                question: "In a calorimetry experiment involving an acid and a base, the temperature of the solution increases significantly. What does this indicate about the reaction?",
                options: [
                  "It is an exothermic reaction.",
                  "It is an endothermic reaction.",
                  "There is no energy change.",
                  "It is solely a physical change."
                ],
                correctAnswer: 0,
                orderIndex: 1,
                points: 25,
                hint: "Think about where the heat is going if the surrounding water gets warmer.",
                explanation: "An increase in the solution's temperature means the reaction released heat into the surroundings, indicating an exothermic process like neutralization."
              },
              {
                question: "Which of the following variables is absolutely required to calculate the enthalpy change using the formula ΔH = mcΔT?",
                options: [
                  "The specific heat capacity of the solution",
                  "The pH of the final solution",
                  "The volume of gas produced",
                  "The atmospheric pressure in the lab"
                ],
                correctAnswer: 0,
                orderIndex: 2,
                points: 25,
                hint: "The 'c' in the equation represents an intensive property of the substance being heated or cooled.",
                explanation: "The specific heat capacity (c) is essential, along with the mass (m) and temperature change (ΔT), to accurately calculate enthalpy changes from experimental results."
              },
              {
                question: "According to the curriculum, calculating the enthalpy of solution can be experimentally demonstrated by dissolving which of the following pairs of solutes?",
                options: [
                  "NH4Cl and CaCl2",
                  "HCl and NaOH",
                  "Maize and Groundnut",
                  "Zinc and Copper"
                ],
                correctAnswer: 0,
                orderIndex: 3,
                points: 25,
                hint: "Enthalpy of solution involves dissolving solid salts into a solvent like water.",
                explanation: "The curriculum specifies determining the enthalpy of solution using solid solutes such as NH4Cl and CaCl2."
              },
              {
                question: "What is the primary application of Hess's law of constant heat summation in thermochemistry?",
                options: [
                  "To calculate enthalpy changes that cannot be found by direct experiment.",
                  "To measure the exact rate and speed of a chemical reaction.",
                  "To determine the molar mass of an unknown ideal gas.",
                  "To find the concentration of an unknown acid."
                ],
                correctAnswer: 0,
                orderIndex: 4,
                points: 25,
                hint: "It relies on constructing energy cycle diagrams to find indirect pathways.",
                explanation: "Hess's Law is applied to construct simple energy cycle diagrams and calculate relevant enthalpy changes that are difficult or impossible to determine by direct experiment."
              },
              {
                question: "When designing a calorimetry experiment to determine the enthalpy change of combustion, which of the following items would be appropriate to test?",
                options: [
                  "Alcohols and food substances like groundnut",
                  "Dilute hydrochloric acid and sodium hydroxide",
                  "Noble gases like Helium and Neon",
                  "Aqueous solutions of Zinc and Copper sulphate"
                ],
                correctAnswer: 0,
                orderIndex: 5,
                points: 25,
                hint: "Combustion requires burning a fuel or an energy-dense biological source.",
                explanation: "The curriculum states that the enthalpy change of combustion can be experimentally determined for alcohols and common food substances, such as maize or groundnut."
              }
            ]
          }
        ]
      }
    ]
  }
];