import * as React from 'react'
import { Metadata } from 'next'
import { EditorClient } from './client'

export const metadata: Metadata = {
  title: 'Module Editor | OpenLearn',
  description: 'Create and edit interactive 3D science labs.',
}

export default function EditorPage() {
  return <EditorClient />
}
