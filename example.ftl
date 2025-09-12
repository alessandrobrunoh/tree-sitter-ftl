<#import "template.ftl" as layout>
<@layout.registrationLayout displayMessage=false; section>
    <#if section = "header">
        <#if messageHeader??>
        ${messageHeader}
        <#else>
        ${message.summary}
        </#if>
    <#elseif section = "form">
    <div id="kc-info-message">

        <#-- Qui inizia la nostra logica di redirect -->
        <#if message.summary?keep_before(" ") == "accountUpdatedMessage" || message.summary == msg("accountUpdatedMessage")>
            <#-- Controlla se l'Home URL (client.baseUrl) è impostato per questo client -->
            <#if client.baseUrl?has_content>
                <script type="text/javascript">
                    // Usa il valore di client.baseUrl passato da Keycloak
                    var redirectUrl = "${client.baseUrl}";

                    // Esegui il redirect dopo un breve ritardo
                    //setTimeout(function() { window.location.href = redirectUrl; }, 1000);
                </script>
                <p>You will be redirected to your application shortly or click <a href="${redirectUrl}">here</a>.</p>
            <#else>
                <#-- Fallback: se non c'è un Home URL, mostra il link standard per tornare all'applicazione (se disponibile) -->
                <#if client.name?has_content>
                    <p>Return to the <a href="${client.baseUrl!'#'}">${client.name}</a> application.</p>
                </#if>
            </#if>
        </#if>



        <p class="instruction">${message.summary}<#if requiredActions??><#list requiredActions>: <b><#items as reqActionItem>${kcSanitize(msg("requiredAction.${reqActionItem}"))?no_esc}<#sep>, </#items></b></#list><#else></#if></p>
        <#if skipLink??>
        <#else>
            <#if pageRedirectUri?has_content>
                <p><a href="${pageRedirectUri}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
            <#elseif actionUri?has_content>
                <p><a href="${actionUri}">${kcSanitize(msg("proceedWithAction"))?no_esc}</a></p>
            <#elseif (client.baseUrl)?has_content>
                <p><a href="${client.baseUrl}">${kcSanitize(msg("backToApplication"))?no_esc}</a></p>
            </#if>
        </#if>
    </div>
    </#if>
</@layout.registrationLayout>
