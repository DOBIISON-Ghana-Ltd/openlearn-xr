good , now from this can you infer that , there is a these categories of paths to a complete useApi code: these catgories
- fetch of many from protected api route 
- fetch of one from protected api route
- fetch of many from unprotected api route
- fetch of one from unprotected api route
- fetch without touching api route but calling auth from betterauth
- post or patch from protected api route
- post or patch from unprotected api route
- post or patch  without touching api route but calling auth from betterauth
- delete from protected api route
- delete from unprotected api route
- delete  without touching api route but calling auth from betterauth

the reason is that i want to create a super skill so that the ai follows myworkflow exactly 

form what i think, ill need this tructure of the module data extracted to be in this form : 
name: the name of the module ie; 
image: the image to be used on the nodulecard;
subject: the submit the module is in;
grade: the grade level the subject is in; ie; Year 1;
duration: for now all should be constant 20 min;
difficultyLevel: could be hard , medium , easy , for now randomly attached to modules
notes: {
  overview: {
    description: a description of the module,
    objectives(stringp[]): string list of the module
  },
  engage: {
    curiosityQuestion: one question that drive to instill some curiosity about what they are coming to do in the module,
    preAssesment: {
      questions: a strig question,
      options: string list of options , [...3 otions, "I Dont Know"],
      answer: index of in the above list whhich is the correct answer
    }[]
  },
explanation: { // this part tries to explain the various lab materials and tools that will used.
    items: {
      name: the name of the lab material or tool,
      image: a link to the image,
      description: we try to exlain it here or explain its function if its a lab tool
    }[] // this is a list of objects
    keyTakeAways: {
      phrase: a phrase in the module topic that will need some short explanation,
      description: a short description of the phrase above
    }
  }
};
checkpointQuestions: {
  question: the question to answer,
  options: [] string list of the possible answers,
  answer: the index of the correct answer,
  hint: a string hint that is to quide students to the answer,
  explanation: string explanation that will let student know why thats the answer
}
simulation: a v1 ideation of how the simulation should be since the model will have access to the curriculum which specifies the practicals and the pdf which will all help provide go notes json that works well cause ie the explanable part in notes will have the right list of items that coud be in the simulation,
controls: {
  type: number | toggle | slider | select,
  options: optional list of strings for slect type controls,
  value: the value of the control,
  defaultVaue: the default value of the control,
  description: what the control does,
  label: the name of the control, could be a phrase
}[] a list of objects......