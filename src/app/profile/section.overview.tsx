"use client";

import { Camera, Mail, MapPin, Pencil, Phone } from "lucide-react";
import useApi from "@/data/hooks/use-api";

export default function OverviewSection() {
  const { data: profile } = useApi.query("app:user:get:profile");

  const contactDetails = [
    { icon: Mail, value: profile?.email ?? "kofi.antwi@school.edu.gh" },
    { icon: Phone, value: profile?.phone ?? "+233 24 567 8901" },
    { icon: MapPin, value: profile?.location ?? "Accra, Ghana" }
  ];

  const academicMeta = [
    { label: "School", value: profile?.school ?? "Accra Senior High School" },
    { label: "Class / Level", value: profile?.classLevel ?? "SHS 2 - Science" },
    { label: "Member Since", value: profile?.memberSince ?? "Jan 20, 2024" }
  ];

  return (
    <div className="bg-surface-white rounded-2xl border border-primary-light/40 p-8 flex gap-10">
      {/* Avatar Placeholder */}
      <div className="relative size-24 sm:size-28 rounded-full bg-primary-light flex items-center justify-center shrink-0">
        <div className="absolute bottom-0 right-0 size-7 rounded-full bg-primary-cta flex items-center justify-center text-primary-text-light ring-2 ring-surface-white cursor-pointer hover:bg-primary-hover transition-colors">
          <Camera className="size-3.5" />
        </div>
      </div>

      <div className="flex-1 space-y-6">

        <div className="flex justify-between items-center">
          {/* Profile Info */}
          <div>
            <h2 className="text-h5 font-semibold text-primary-text-dark leading-tight">
              {profile?.name ?? "Kofi Antwi"}
            </h2>
            <span className="text-small font-semibold text-primary-cta">
              {profile?.role ?? "Learner"}
            </span>
          </div>
          {/* Edit Button */}
          <EditProfile />
        </div>

        <div className="flex">
          {/* Contact Details */}
          <div className="flex-1 space-y-3 text-small text-secondary-text font-normal">
            {contactDetails.map((contact, index) => (
              <div key={index} className="flex items-center gap-2">
                <contact.icon className="size-4 text-tertiary shrink-0" />
                <span>{contact.value}</span>
              </div>
            ))}
          </div>

          {/* Academic Meta */}
          <div className="flex-1 grid grid-cols-2 gap-6">
            {academicMeta.map((meta, index) => (
              <div key={index} className="space-y-2">
                <span className="block text-caption font-medium text-tertiary uppercase tracking-wider">
                  {meta.label}
                </span>
                <span className="text-small font-semibold text-primary-text-dark leading-snug">
                  {meta.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
};

function EditProfile() {
  return (
    <button
      type="button"
      className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl border border-primary-cta text-primary-cta font-semibold text-small hover:bg-primary-subtle transition-colors"
    >
      <Pencil className="size-3.5" />
      <span>Edit Profile</span>
    </button>
  )
}