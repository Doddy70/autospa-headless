import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { branchMapUrl, branchWhatsapp, type ContactBranch, whatsappLink } from '@/data/contact';

/**
 * One branch block: name, address, phone numbers, opening hours and the
 * Google Maps embed - the same five fields production publishes per branch.
 *
 * The WhatsApp button hands the visitor over to the branch itself, not to
 * the central number of the site: every branch publishes its own line.
 */
export default function BranchCard({ branch }: { branch: ContactBranch }) {
	const mapUrl = branchMapUrl(branch);
	const whatsappNumber = branchWhatsapp(branch);
	const whatsappHref = whatsappLink(
		`Halo AutoSPA Jakarta, saya ingin bertanya soal layanan di ${branch.name}.`,
		whatsappNumber,
	);

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

				<a
					href={whatsappHref}
					target="_blank"
					rel="noopener noreferrer"
					data-testid="branch-whatsapp"
					data-branch={branch.slug}
					className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-[#00B14F] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#00a044]"
				>
					<MessageCircle className="size-4" />
					WhatsApp {branch.name}
				</a>
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
