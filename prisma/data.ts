import z from "zod";
import schema from "../src/data/api/new.admin/schema";

type IData = z.infer<typeof schema.SeedModules>;

export const data: IData = [
  {
    name: "Physics",
    slug: "physics",
    grade: "Year 1",
    description: "Senior High School Physics curriculum covering physical quantities, measurement techniques, thermometry, and mechanics.",
    modules: [
      {
        title: "Measurement of Physical Quantities",
        slug: "measurement-of-physical-quantities",
        image: "/images/modules/physics/measurement-of-physical-quantities.jpg",
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
                    image: "/assets/models/vernier_caliper.png",
                    description: "A precision instrument used to measure internal and external diameters, as well as depths, with high accuracy."
                  },
                  {
                    name: "Micrometer Screw Gauge",
                    image: "/assets/models/micrometer.png",
                    description: "An extremely precise tool ideal for measuring very small lengths or thicknesses, such as the diameter of a wire or thickness of paper."
                  },
                  {
                    name: "Electronic Balance",
                    image: "/assets/models/electronic_balance.png",
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
                points: 10,
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
                points: 10,
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
                points: 10,
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
                points: 10,
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
                points: 10,
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
        image: "/images/modules/physics/electroscope.jpg",
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
                    image: "/assets/models/electroscope_cap.png",
                    description: "A brass disc at the top of the electroscope where charged objects are brought near or touched."
                  },
                  {
                    name: "Brass Stem & Gold Leaf",
                    image: "/assets/models/electroscope_leaf.png",
                    description: "A conductive brass rod that extends downwards, with a highly sensitive, extremely thin piece of gold foil attached to its lower end."
                  },
                  {
                    name: "Glass Casing",
                    image: "/assets/models/electroscope_casing.png",
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
                points: 10,
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
                points: 10,
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
                points: 10,
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
                points: 10,
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
                points: 10,
                hint: "Think about what might happen to a very thin, lightweight piece of foil if someone breathes on it.",
                explanation: "The gold leaf is extremely thin and light, making it highly susceptible to being blown around by drafts or air currents in the room. The glass casing isolates the leaf so that any movement observed is strictly due to electrostatic forces."
              }
            ]
          }
        ]
      }
    ]
  }
];