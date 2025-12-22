import {
  Terminal as TerminalIcon,
  Link,
  HardDrive,
  Clock,
  Gift,
  Lock,
  Download,
  Eye,
} from 'lucide-react';
import { getConfig } from '../types/config';

const baseFeatures = [
  {
    icon: TerminalIcon,
    title: 'Made for the shell',
    description: 'Upload files directly from your terminal',
  },
  { icon: Link, title: 'Share with a URL', description: 'Get a unique link for every file' },
  { icon: Gift, title: 'Free to use', description: 'No account required' },
  { icon: Lock, title: 'Encrypt your files', description: 'Use GPG or OpenSSL encryption' },
  { icon: Download, title: 'Limit downloads', description: 'Set maximum download count' },
  { icon: Eye, title: 'Preview in browser', description: 'View images, videos, code & more' },
];

export function Features() {
  const config = getConfig();

  const features = [
    ...baseFeatures.slice(0, 2),
    {
      icon: HardDrive,
      title: config.maxUploadSize ? `Upload up to ${config.maxUploadSize}` : 'Unlimited uploads',
      description: 'No file size restrictions',
    },
    {
      icon: Clock,
      title: config.purgeTime ? `Stored for ${config.purgeTime}` : 'Stored forever',
      description: 'Files available when you need them',
    },
    ...baseFeatures.slice(2),
  ];

  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-center mb-12">Features</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center p-4">
              <Icon className="w-8 h-8 mx-auto mb-3 text-primary-600 dark:text-primary-400" />
              <h3 className="font-medium mb-1">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
