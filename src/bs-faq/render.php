<?php
/**
 * Render template for bs-plugins/bs-faq
 *
 * @var array $attributes Block attributes.
 */

$kategorie = $attributes['kategorie'] ?? [];

$sekcja_style = bs_block_sekcja_style( $attributes );
$wrapper_args = [ 'class' => 'blok-faq' ];
if ( $sekcja_style ) {
	$wrapper_args['style'] = $sekcja_style;
}
$wrapper_attrs = get_block_wrapper_attributes( $wrapper_args );
?>
<div <?php echo $wrapper_attrs; ?>>
	<div class="blok-faq__sidebar">
		<h2 class="blok-faq__marka">FAQ</h2>
		<ul class="blok-faq__taby" role="tablist">
			<?php foreach ( $kategorie as $i => $kategoria ) : ?>
				<li role="presentation">
					<button
						type="button"
						class="blok-faq__tab<?php echo 0 === $i ? ' is-active' : ''; ?>"
						role="tab"
						aria-selected="<?php echo 0 === $i ? 'true' : 'false'; ?>"
						data-faq-tab="<?php echo esc_attr( $i ); ?>"
					>
						<?php echo wp_kses_post( $kategoria['nazwa'] ?? '' ); ?>
					</button>
				</li>
			<?php endforeach; ?>
		</ul>
	</div>

	<div class="blok-faq__content">
		<?php foreach ( $kategorie as $i => $kategoria ) : ?>
			<div
				class="blok-faq__panel<?php echo 0 === $i ? ' is-active' : ''; ?>"
				data-faq-panel="<?php echo esc_attr( $i ); ?>"
				<?php echo 0 === $i ? '' : 'hidden'; ?>
			>
				<h3 class="blok-faq__panel-tytul"><?php echo wp_kses_post( $kategoria['nazwa'] ?? '' ); ?></h3>
				<div class="blok-faq__lista">
					<?php foreach ( ( $kategoria['pytania'] ?? [] ) as $pytanie ) : ?>
						<?php if ( empty( $pytanie['pytanie'] ) ) : continue; endif; ?>
						<div class="blok-faq__pozycja">
							<button type="button" class="blok-faq__pytanie" aria-expanded="false">
								<span class="blok-faq__pytanie-tekst"><?php echo wp_kses_post( $pytanie['pytanie'] ); ?></span>
								<span class="blok-faq__ikona" aria-hidden="true"></span>
							</button>
							<?php if ( ! empty( $pytanie['odpowiedz'] ) ) : ?>
								<div class="blok-faq__odpowiedz" hidden>
									<?php echo wp_kses_post( $pytanie['odpowiedz'] ); ?>
								</div>
							<?php endif; ?>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endforeach; ?>
	</div>
</div>
