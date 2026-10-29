import { Clock, MapPin, Phone } from 'lucide-react';
import { branchMapUrl, type ContactBranch } from '@/data/contact';

/**
 * One branch block: name, address, phone numbers, opening hours and the
 * Google Maps embed - the same five fields production publishes per branch.
 */
export default function BranchCard({ branch }: { branch: ContactBranch }) {
	const mapUrl = branchMapUrl(branch);

	return (
		<article className="grid gap-6 rounded-2xl border border-white/10 bg-background-7 p-6 transition-colors hover:border-primary-500/40 lg:grid-cols-2 lg:gap-8 lg:p-8">
			<div>
				<h3 className="text-xl font-bold text-white lg:text-2xl">{branch.name}</h3>

				<ul className="mt-5 space-y-3 text-sm leading-relaxed text-white/70">
					{branch.address && (
						<li className="flex gap-3">
							<MapPin className="mt-0.5 size-5 shrink-0 text-primary-500" />
							<span>{branch.address}</span>
						</li>
					)}

					<li className="flex gap-3">
						<Phone className="mt-0.5 size-5 shrink-0 text-primary-500" />
						<span>{branch.phones.join(' / ')}</span>
					</li>

					<li className="flex gap-3">
						<Clock className="mt-0.5 size-5 shrink-0 text-primary-500" />
						<span>Open Hours: {branch.hours}</span>
					</li>
				</ul>
			</div>

			{mapUrl && (
				<div className="overflow-hidden rounded-xl border border-white/10">
					<iframe
						title={`${branch.name} map`}
						src={mapUrl}
						loading="lazy"
						referrerPolicy="no-referrer-when-downgrade"
						className="h-56 w-full border-0 grayscale-[35%] lg:h-full lg:min-h-56"
					/>
				</div>
			)}
		</article>
	);
}
