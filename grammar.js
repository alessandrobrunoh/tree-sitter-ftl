module.exports = grammar({
  name: 'ftl',

  extras: $ => [
    $.line_comment,
    $.block_comment,
    /\s/
  ],

  rules: {
    source_file: $ => repeat($._definition),

    _definition: $ => choice(
      $.entity_declaration,
      $.html_tag,
      $.variable
    ),

    // Comments are handled in extras
    line_comment: $ => token(seq('//', /.*/)),

    block_comment: $ => token(seq(
      '/*',
      /[^*]*\*+([^/*][^*]*\*+)*/,
      '/'
    )),

    // Entity declaration
    entity_declaration: $ => seq(
      'entity',
      $.identifier,
      optional($.entity_body)
    ),

    entity_body: $ => seq(
      '{',
      optional(repeat($.field_declaration)),
      '}'
    ),

    field_declaration: $ => seq(
      $.identifier,
      ':',
      $.identifier
    ),

    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,



    html_tag: $ => seq(
      '<',
      optional(repeat($.field_declaration)),
      '>'
    ),

    variable: $ => seq(
      '${',
      optional(repeat($.field_declaration)),
      '}'
    ),
  },
});

// Helper function for comma-separated lists
function sep1(rule, separator) {
  return seq(rule, repeat(seq(separator, rule)));
}
