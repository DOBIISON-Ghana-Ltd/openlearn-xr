import { Metadata } from 'next';
import SessionWaitingRoomClient from './client';

export const metadata: Metadata = {
  title: 'Session Waiting Room',
  description: 'Manage session participants in the Open Learn XR waiting room.',
};

export default function SessionWaitingRoomPage() {
  return <SessionWaitingRoomClient />;
}