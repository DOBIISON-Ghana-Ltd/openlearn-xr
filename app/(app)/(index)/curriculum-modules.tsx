import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function CurriculumModules() {
  const subjects = [
    {
      title: 'Chemistry',
      description: 'Form 1 - Form 4',
      topics: ['Acid-Base Titrations', 'Separation of Mixtures', 'Properties of Metals'],
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    },
    {
      title: 'Physics',
      description: 'Form 1 - Form 4',
      topics: ['Refraction of Light', 'Electrical Circuits', 'Heat Energy Transfer'],
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20'
    },
    {
      title: 'Biology',
      description: 'Form 1 - Form 4',
      topics: ['Plant Cell Structures', 'Testing for Food Nutrients', 'Ecology Ecosystems'],
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    }
  ]

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Curriculum-Aligned Virtual Labs</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Built directly around the national Ghanaian science syllabus. Our virtual modules are vetted by the Ghana Education Service (GES) to ensure that students master core practical skills and abstract concepts safely and interactively.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {subjects.map((subject, index) => (
            <Card key={index} className={`border ${subject.color} bg-card hover:shadow-lg transition-shadow duration-300`}>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{subject.title}</CardTitle>
                <p className="text-sm font-medium opacity-80">{subject.description}</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {subject.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="mt-1 h-2 w-2 rounded-full bg-current opacity-60" />
                      <span className="text-foreground">{topic}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
